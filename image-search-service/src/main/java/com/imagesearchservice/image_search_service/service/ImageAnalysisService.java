package com.imagesearchservice.image_search_service.service;

import com.imagesearchservice.image_search_service.model.GeminiResponse;
import com.imagesearchservice.image_search_service.model.ImageAnalysisResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import java.util.Base64;

@Service
public class ImageAnalysisService {
    private final GeminiApiService geminiApiService;

    public ImageAnalysisService(GeminiApiService geminiApiService) {
        this.geminiApiService = geminiApiService;
    }

    public Mono<ImageAnalysisResponse> analyzeImage(MultipartFile file) {
        try {
            String mimeType = file.getContentType();
            byte[] fileBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(fileBytes);

            return geminiApiService.analyzeImage(base64Image, mimeType)
                    .map(response -> {
                        String category = extractCategoryFromResponse(response);
                        return new ImageAnalysisResponse(category);
                    });
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    private String extractCategoryFromResponse(GeminiResponse response) {
        if (response.getCandidates() == null || response.getCandidates().isEmpty()) {
            return "unknown";
        }

        GeminiResponse.Candidate candidate = response.getCandidates().get(0);
        if (candidate.getContent() == null || candidate.getContent().getParts() == null ||
                candidate.getContent().getParts().isEmpty()) {
            return "unknown";
        }

        String text = candidate.getContent().getParts().get(0).getText();
        if (text == null) {
            return "unknown";
        }

        // Clean up the response - we asked for just the category name
        return text.trim().toLowerCase();
    }
}