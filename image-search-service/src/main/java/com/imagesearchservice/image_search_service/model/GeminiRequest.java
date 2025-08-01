package com.imagesearchservice.image_search_service.model;


import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class GeminiRequest {
    private List<Content> contents;

    @Data
    public static class Content {
        private List<Part> parts;

        public Content() {
            this.parts = new ArrayList<>();
        }
    }

    @Data
    public static class Part {
        private String text;
        private InlineData inlineData;

        public Part(String text) {
            this.text = text;
        }

        public Part(InlineData inlineData) {
            this.inlineData = inlineData;
        }
    }

    @Data
    public static class InlineData {
        private String mimeType;
        private String data;

        public InlineData(String mimeType, String data) {
            this.mimeType = mimeType;
            this.data = data;
        }
    }
}