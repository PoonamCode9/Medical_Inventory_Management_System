package com.MediStock.app.controllers;

import com.MediStock.app.dto.DashboardResponse;
import com.MediStock.app.services.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {

        this.reportService = reportService;

    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboardReport() {

        return reportService.getDashboardReport();

    }

}