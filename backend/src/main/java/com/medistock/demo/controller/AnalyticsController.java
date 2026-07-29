package com.medistock.demo.controller;


import com.medistock.demo.dto.AnalyticsResponse;
import com.medistock.demo.service.AnalyticsService;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins="http://localhost:3000")
public class AnalyticsController {



    private final AnalyticsService analyticsService;



    public AnalyticsController(
            AnalyticsService analyticsService
    ){

        this.analyticsService = analyticsService;

    }







    @GetMapping
    public AnalyticsResponse getAnalytics(){


        return analyticsService.getAnalytics();


    }



}