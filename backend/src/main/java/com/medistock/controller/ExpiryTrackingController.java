package com.medistock.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.medistock.entity.ExpiryTracking;
import com.medistock.service.ExpiryTrackingService;

@RestController
@RequestMapping("/api/expirytracking")
public class ExpiryTrackingController {

    private final ExpiryTrackingService expiryTrackingService;

    public ExpiryTrackingController(ExpiryTrackingService expiryTrackingService) {
        this.expiryTrackingService = expiryTrackingService;
    }

    @PostMapping
    public ExpiryTracking addExpiryTracking(@RequestBody ExpiryTracking expiryTracking) {
        return expiryTrackingService.addExpiryTracking(expiryTracking);
    }

    @GetMapping
    public List<ExpiryTracking> getAllExpiryTracking() {
        return expiryTrackingService.getAllExpiryTracking();
    }

    @GetMapping("/{id}")
    public ExpiryTracking getExpiryTrackingById(@PathVariable Long id) {
        return expiryTrackingService.getExpiryTrackingById(id);
    }

    @PutMapping("/{id}")
    public ExpiryTracking updateExpiryTracking(@PathVariable Long id,
                                               @RequestBody ExpiryTracking expiryTracking) {
        return expiryTrackingService.updateExpiryTracking(id, expiryTracking);
    }

    @DeleteMapping("/{id}")
    public String deleteExpiryTracking(@PathVariable Long id) {
        expiryTrackingService.deleteExpiryTracking(id);
        return "Expiry Tracking deleted successfully";
    }
}