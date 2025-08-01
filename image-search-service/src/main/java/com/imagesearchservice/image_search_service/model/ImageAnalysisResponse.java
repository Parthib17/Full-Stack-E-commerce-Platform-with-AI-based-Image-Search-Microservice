package com.imagesearchservice.image_search_service.model;

import lombok.Data;

@Data
public class ImageAnalysisResponse {
    private String category;

    public ImageAnalysisResponse(String category) {
        this.category = category;
    }
}