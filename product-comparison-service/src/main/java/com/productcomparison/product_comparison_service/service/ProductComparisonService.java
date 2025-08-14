package com.productcomparison.product_comparison_service.service;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;

import jakarta.annotation.PostConstruct;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductComparisonService {

    private static final Logger logger = LoggerFactory.getLogger(ProductComparisonService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.version:v1beta}")
    private String apiVersion;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    private String GEMINI_URL;

    private final OkHttpClient client = new OkHttpClient();

    // Cache results for 24 hours
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    // Rate limiter: 1 request every 10 seconds (~6/minute, under free-tier limits)
    private final RateLimiter rateLimiter = new RateLimiter(6, 60);

    @PostConstruct
    public void init() {
        GEMINI_URL = String.format(
                "https://generativelanguage.googleapis.com/%s/models/%s:generateContent",
                apiVersion, model
        );
        logger.info("Initialized Gemini API URL: {}", GEMINI_URL);
    }

    @Retryable(
            value = {RateLimitException.class},
            maxAttempts = 3,
            backoff = @Backoff(delayExpression = "${retry.delay:30000}")
    )
    public String compareProducts(String product1, String product2) throws ApiException {
        String cacheKey = generateCacheKey(product1, product2);

        // 1. Check cache first
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            logger.info("Returning cached result for products: {} vs {}", product1, product2);
            return cached.result;
        }

        // 2. Apply rate limiting
        try {
            rateLimiter.acquire();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException("Rate limiting interrupted", e);
        }

        // 3. Call API
        try {
            String result = callGeminiAPI(product1, product2);
            cache.put(cacheKey, new CacheEntry(result, 24 * 60 * 60)); // Cache for 24h
            return result;
        } catch (RateLimitException e) {
            // Fallback to expired cache if available
            if (cached != null) {
                logger.warn("Quota exceeded, returning expired cached result for products: {} vs {}", product1, product2);
                return cached.result;
            }
            cache.remove(cacheKey);
            throw e;
        } catch (Exception e) {
            // Fallback to expired cache if available
            if (cached != null) {
                logger.warn("API call failed, returning expired cached result for products: {} vs {}", product1, product2);
                return cached.result;
            }
            throw new ApiException("Comparison failed", e);
        }
    }

    private String callGeminiAPI(String product1, String product2) throws ApiException {
        try {
            // Updated prompt for structured output
            String prompt = String.format(
                    "Compare (1) %s vs (2) %s in 3-5 bullet points, each highlighting a key difference including technical features(like processor, hardware, ram, cloth material etc.. " +
                            "Conclude with a final opinion on which product is better and why, in 1-2 sentences. " +
                            "Format the response as follows:\n" +
                            "- Point 1: [Comparison point]\n" +
                            "- Point 2: [Comparison point]\n" +
                            "- Point 3: [Comparison point]\n" +
                            "- [Optional Point 4: Comparison point]\n" +
                            "- [Optional Point 5: Comparison point]\n" +
                            "Final Opinion: [Your recommendation and reasoning]\n" +
                            "Keep the total response under 150 words.",
                    product1, product2
            );

            JSONObject requestBody = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text", prompt))
                                    )
                            )
                    );

            logger.debug("Sending request to Gemini API: URL={}, Body={}", GEMINI_URL + "?key=" + apiKey, requestBody.toString());

            Request request = new Request.Builder()
                    .url(GEMINI_URL + "?key=" + apiKey)
                    .post(RequestBody.create(
                            requestBody.toString(),
                            MediaType.get("application/json")
                    ))
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    handleErrorResponse(response);
                }
                ResponseBody body = response.body();
                if (body == null) {
                    throw new ApiException("Empty response body");
                }
                String responseBody = body.string();
                logger.debug("Received response from Gemini API: {}", responseBody);
                return extractContentFromResponse(responseBody);
            }
        } catch (Exception e) {
            logger.error("Failed to call Gemini API", e);
            throw new ApiException("API call failed", e);
        }
    }

    // --- Helper Methods ---
    private String generateCacheKey(String product1, String product2) {
        return (product1.trim() + "||" + product2.trim()).toLowerCase();
    }

    private String extractContentFromResponse(String responseBody) throws ApiException {
        try {
            JSONObject jsonResponse = new JSONObject(responseBody);
            JSONArray candidates = jsonResponse.getJSONArray("candidates");
            if (candidates.isEmpty()) {
                throw new ApiException("No candidates in response");
            }

            JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
            JSONArray parts = content.getJSONArray("parts");
            if (parts.isEmpty()) {
                throw new ApiException("No parts in response");
            }

            String text = parts.getJSONObject(0).getString("text");

            // Parse the text into a structured JSON object
            JSONObject structuredResponse = new JSONObject();
            JSONArray comparisonPoints = new JSONArray();
            String finalOpinion = "";
            String[] lines = text.split("\n");
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("- Point")) {
                    comparisonPoints.put(line.replaceFirst("^- Point \\d+: ", ""));
                } else if (line.startsWith("Final Opinion: ")) {
                    finalOpinion = line.replaceFirst("^Final Opinion: ", "");
                }
            }

            structuredResponse.put("comparisonPoints", comparisonPoints);
            structuredResponse.put("finalOpinion", finalOpinion);

            return structuredResponse.toString();
        } catch (Exception e) {
            logger.error("Failed to parse Gemini API response: {}", responseBody, e);
            throw new ApiException("Failed to parse response", e);
        }
    }

    private void handleErrorResponse(Response response) throws ApiException {
        try {
            String errorBody = response.body() != null ? response.body().string() : "{}";
            if (response.code() == 429) {
                JSONObject errorJson = new JSONObject(errorBody);
                String retryDelay = "30000"; // Default 30s
                if (errorJson.has("error") && errorJson.getJSONObject("error").has("details")) {
                    JSONArray details = errorJson.getJSONObject("error").getJSONArray("details");
                    for (int i = 0; i < details.length(); i++) {
                        JSONObject detail = details.getJSONObject(i);
                        if ("type.googleapis.com/google.rpc.RetryInfo".equals(detail.getString("@type"))) {
                            retryDelay = detail.getString("retryDelay").replace("s", "000"); // Convert to ms
                        }
                        if ("type.googleapis.com/google.rpc.QuotaFailure".equals(detail.getString("@type"))) {
                            logger.error("Quota violations: {}", detail.getJSONArray("violations").toString());
                        }
                    }
                }
                logger.warn("Rate limit exceeded: {}. Suggested retry delay: {}ms", errorBody, retryDelay);
                System.setProperty("retry.delay", retryDelay); // Update retry delay dynamically
                throw new RateLimitException("Quota exceeded. Response: " + errorBody);
            } else if (response.code() == 404) {
                logger.error("Model or endpoint not found: {}", errorBody);
                throw new ApiException("Model or endpoint not found. Please check the model name and API version. Response: " + errorBody);
            }
            logger.error("API error: {}", errorBody);
            throw new ApiException("API error: " + errorBody);
        } catch (Exception e) {
            logger.error("Failed to handle error response", e);
            throw new ApiException("Failed to handle error", e);
        }
    }

    // --- Inner Classes ---
    private static class CacheEntry {
        final String result;
        final Instant expiry;

        CacheEntry(String result, int ttlSeconds) {
            this.result = result;
            this.expiry = Instant.now().plusSeconds(ttlSeconds);
        }

        boolean isExpired() {
            return Instant.now().isAfter(expiry);
        }
    }

    // Thread-safe rate limiter
    private static class RateLimiter {
        private final Semaphore semaphore;
        private final int maxPermits;
        private final long periodInMillis;
        private final ScheduledExecutorService scheduler;

        public RateLimiter(int permits, int periodInSeconds) {
            this.semaphore = new Semaphore(permits);
            this.maxPermits = permits;
            this.periodInMillis = periodInSeconds * 1000L;
            this.scheduler = Executors.newScheduledThreadPool(1);
            this.scheduler.scheduleAtFixedRate(
                    () -> semaphore.release(maxPermits - semaphore.availablePermits()),
                    periodInMillis,
                    periodInMillis,
                    TimeUnit.MILLISECONDS
            );
        }

        public void acquire() throws InterruptedException {
            semaphore.acquire();
        }
    }

    // Custom Exceptions
    public static class ApiException extends Exception {
        public ApiException(String message) { super(message); }
        public ApiException(String message, Throwable cause) { super(message, cause); }
    }

    public static class RateLimitException extends ApiException {
        public RateLimitException(String message) { super(message); }
        public RateLimitException(String message, Throwable cause) { super(message, cause); }
    }
}