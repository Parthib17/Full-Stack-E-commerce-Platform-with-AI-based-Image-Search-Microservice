package com.imagesearchservice.image_search_service.dto;


import java.util.List;

/**
 * Main request DTO for Gemini API calls
 */
public class GeminiRequest {
    private List<Content> contents;

    public GeminiRequest() {}

    public GeminiRequest(List<Content> contents) {
        this.contents = contents;
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }
}
