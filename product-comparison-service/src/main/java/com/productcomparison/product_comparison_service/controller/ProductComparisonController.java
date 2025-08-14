package com.productcomparison.product_comparison_service.controller;

import com.productcomparison.product_comparison_service.dto.ComparisonResult;
import com.productcomparison.product_comparison_service.dto.ProductRequest;
import com.productcomparison.product_comparison_service.service.ProductComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/compare")
@RequiredArgsConstructor
public class ProductComparisonController {

    private static final Logger log = LoggerFactory.getLogger(ProductComparisonController.class);

    private final ProductComparisonService service;

    @PostMapping
    public ResponseEntity<ComparisonResult> compareProducts(@RequestBody ProductRequest request) {
        try {
            if (request.getProductDescriptions() == null || request.getProductDescriptions().size() != 2) {
                return ResponseEntity.badRequest().body(new ComparisonResult("Exactly 2 product descriptions are required"));
            }

            String comparisonResult = service.compareProducts(
                    request.getProductDescriptions().get(0),
                    request.getProductDescriptions().get(1)
            );
            return ResponseEntity.ok(new ComparisonResult(comparisonResult));
        } catch (Exception e) {
            log.error("Error comparing products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}