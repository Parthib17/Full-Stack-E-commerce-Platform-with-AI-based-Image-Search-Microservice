package com.imagesearchservice.image_search_service.dto;


import jakarta.servlet.http.Part;

import java.util.List;

/**
 * Represents content in a Gemini API request
 */
public class Content {
    private List<Part> parts;

    public Content() {}

    public Content(List<Part> parts) {
        this.parts = parts;
    }

    public List<Part> getParts() {
        return parts;
    }

    public void setParts(List<Part> parts) {
        this.parts = parts;
    }
}