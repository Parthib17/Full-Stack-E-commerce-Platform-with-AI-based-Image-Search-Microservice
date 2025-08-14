package com.productcomparison.product_comparison_service.dto;

import java.util.List;

public class ProductRequest {
    private List<String> productDescriptions;

    // Getters and setters
    public List<String> getProductDescriptions() {
        return productDescriptions;
    }

    public void setProductDescriptions(List<String> productDescriptions) {
        this.productDescriptions = productDescriptions;
    }
}