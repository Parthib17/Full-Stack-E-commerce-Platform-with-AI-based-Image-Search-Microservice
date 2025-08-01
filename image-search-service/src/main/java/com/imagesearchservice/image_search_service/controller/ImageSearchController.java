package com.imagesearchservice.image_search_service.controller;

import com.imagesearchservice.image_search_service.model.ImageAnalysisResponse;
import com.imagesearchservice.image_search_service.service.ImageAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1")
public class ImageSearchController {
    private final ImageAnalysisService imageAnalysisService;

    public ImageSearchController(ImageAnalysisService imageAnalysisService) {
        this.imageAnalysisService = imageAnalysisService;
    }

    @PostMapping("/analyze")
    public Mono<ResponseEntity<ImageAnalysisResponse>> analyzeImage(@RequestPart("image") MultipartFile image) {
        return imageAnalysisService.analyzeImage(image)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }
}