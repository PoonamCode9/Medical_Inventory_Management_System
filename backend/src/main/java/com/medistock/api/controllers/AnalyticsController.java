package com.medistock.api.controllers;

import com.medistock.api.dto.AnalyticsDTO;
import com.medistock.api.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * GET /api/analytics
     * Returns an aggregated analytics snapshot: inventory totals, stock movement
     * totals, and per-category medicine counts.
     * Accessible by all authenticated users.
     */
    @GetMapping
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getInventoryAnalytics());
    }
}
