package com.imagesearchservice.image_search_service.dto;

/**
 * Response DTO for the Image Analysis API
 */
public class ImageAnalysisResponse {
    private String category;
    private String status;
    private String message;

    public ImageAnalysisResponse() {}

    public ImageAnalysisResponse(String category) {
        this.category = category;
        this.status = "success";
    }

    public ImageAnalysisResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
