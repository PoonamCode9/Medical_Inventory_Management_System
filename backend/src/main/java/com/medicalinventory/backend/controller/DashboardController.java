package com.medicalinventory.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.dto.DashboardStatsDTO;
import com.medicalinventory.backend.dto.LowStockAlertDTO;
import com.medicalinventory.backend.service.DashboardService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/low-stock-alerts")
    public ResponseEntity<List<LowStockAlertDTO>> getLowStockAlerts() {
        return ResponseEntity.ok(dashboardService.getLowStockAlerts());
    }
}
