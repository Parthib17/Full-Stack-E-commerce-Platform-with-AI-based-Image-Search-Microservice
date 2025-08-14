package com.productcomparison.product_comparison_service.dto;

import lombok.Data;

@Data
public class ComparisonResult {
    private String result;

    public ComparisonResult(String result) {
        this.result = result;
    }

}