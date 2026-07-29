package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.ExpiryAlertResponse;
import com.medistock.backend.service.ExpiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/expiry")
@RequiredArgsConstructor
public class ExpiryController {

    private final ExpiryService expiryService;

    @GetMapping("/alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<ExpiryAlertResponse>>> getExpiryAlerts() {
        List<ExpiryAlertResponse> alerts = expiryService.getExpiryAlerts();
        return ResponseEntity.ok(ApiResponse.<List<ExpiryAlertResponse>>builder()
                .success(true)
                .message("Fetched batch expiry alert warnings.")
                .data(alerts)
                .build());
    }

    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<ExpiryAlertResponse>>> getExpiredMedicines() {
        List<ExpiryAlertResponse> list = expiryService.getExpiredMedicines();
        return ResponseEntity.ok(ApiResponse.<List<ExpiryAlertResponse>>builder()
                .success(true)
                .message("Fetched expired medicines.")
                .data(list)
                .build());
    }

    @GetMapping("/critical")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<ExpiryAlertResponse>>> getCriticalMedicines() {
        List<ExpiryAlertResponse> list = expiryService.getCriticalMedicines();
        return ResponseEntity.ok(ApiResponse.<List<ExpiryAlertResponse>>builder()
                .success(true)
                .message("Fetched critical medicines.")
                .data(list)
                .build());
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<ExpiryAlertResponse>>> getExpiringMedicines() {
        List<ExpiryAlertResponse> list = expiryService.getExpiringMedicines();
        return ResponseEntity.ok(ApiResponse.<List<ExpiryAlertResponse>>builder()
                .success(true)
                .message("Fetched expiring soon medicines.")
                .data(list)
                .build());
    }

    @GetMapping("/safe")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<ExpiryAlertResponse>>> getSafeMedicines() {
        List<ExpiryAlertResponse> list = expiryService.getSafeMedicines();
        return ResponseEntity.ok(ApiResponse.<List<ExpiryAlertResponse>>builder()
                .success(true)
                .message("Fetched safe medicines.")
                .data(list)
                .build());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    public ResponseEntity<ApiResponse<java.util.Map<String, Long>>> getExpirySummary() {
        java.util.Map<String, Long> summary = expiryService.getExpirySummary();
        return ResponseEntity.ok(ApiResponse.<java.util.Map<String, Long>>builder()
                .success(true)
                .message("Fetched expiry dashboard summary.")
                .data(summary)
                .build());
    }
}
