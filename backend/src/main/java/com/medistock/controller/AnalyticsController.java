package com.medistock.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.dto.AnalyticsResponse;
import com.medistock.service.AnalyticsService;

@RestController
@RequestMapping("/api/reports")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics() {

        return analyticsService.getAnalytics();

    }

}