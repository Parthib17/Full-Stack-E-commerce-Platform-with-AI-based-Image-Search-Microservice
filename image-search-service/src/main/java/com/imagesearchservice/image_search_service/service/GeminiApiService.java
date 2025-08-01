package com.imagesearchservice.image_search_service.service;

import com.imagesearchservice.image_search_service.model.GeminiRequest;
import com.imagesearchservice.image_search_service.model.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class GeminiApiService {
    private final WebClient webClient;
    private final String apiKey;

    public GeminiApiService(
            WebClient.Builder webClientBuilder,
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    // Add this method to match what ImageAnalysisService expects
    public Mono<GeminiResponse> analyzeImage(String base64Image, String mimeType) {
        GeminiRequest request = createRequest(base64Image, mimeType);
        return webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeminiResponse.class);
    }

    private GeminiRequest createRequest(String base64Image, String mimeType) {
        GeminiRequest request = new GeminiRequest();
        GeminiRequest.Content content = new GeminiRequest.Content();

        // Instruction part
        content.getParts().add(new GeminiRequest.Part(
                "Analyze this image and extract just the product category keyword. " +
                        "Return only the single most relevant category name in lowercase, " +
                        "like 'shirt', 'sofa', or 'bottle'. Do not include any other text or explanations."
        ));

        // Image part
        content.getParts().add(new GeminiRequest.Part(
                new GeminiRequest.InlineData(mimeType, base64Image)
        ));

        request.setContents(List.of(content));
        return request;
    }
}