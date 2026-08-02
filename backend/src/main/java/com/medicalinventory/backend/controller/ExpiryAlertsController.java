package com.medicalinventory.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.dto.ExpiryAlertDTO;
import com.medicalinventory.backend.service.ExpiryAlertsService;

@RestController
@RequestMapping("/api/expiry-alerts")
public class ExpiryAlertsController {
    private final ExpiryAlertsService expiryAlertsService;

    public ExpiryAlertsController(ExpiryAlertsService expiryAlertsService) {
        this.expiryAlertsService = expiryAlertsService;
    }

    @GetMapping
    public ResponseEntity<List<ExpiryAlertDTO>> getExpiryAlerts() {
        return ResponseEntity.ok(expiryAlertsService.getExpiryAlerts());
    }
}
