package com.medistock.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.medistock.dto.ReportResponse;
import com.medistock.entity.ExpiryTracking;
import com.medistock.entity.Medicine;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.Report;
import com.medistock.service.ReportService;
import com.medistock.entity.Supplier;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public Report addReport(@RequestBody Report report) {
        return reportService.addReport(report);
    }

    @GetMapping
    public List<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}")
    public Report getReportById(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    @PutMapping("/{id}")
    public Report updateReport(
            @PathVariable Long id,
            @RequestBody Report report) {

        return reportService.updateReport(id, report);
    }

    @DeleteMapping("/{id}")
    public String deleteReport(@PathVariable Long id) {

        reportService.deleteReport(id);

        return "Report deleted successfully";
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardAnalytics() {

        return reportService.getDashboardAnalytics();

    }

    @GetMapping("/inventory")
public List<Medicine> getInventoryReport() {
    return reportService.getInventoryReport();
}

@GetMapping("/lowstock")
public List<Medicine> getLowStockReport() {
    return reportService.getLowStockReport();
}

@GetMapping("/expiry")
public List<ExpiryTracking> getExpiryReport() {
    return reportService.getExpiryReport();
}

@GetMapping("/suppliers")
public List<Supplier> getSupplierReport() {
    return reportService.getSupplierReport();
}

@GetMapping("/purchaseorders")
public List<PurchaseOrder> getPurchaseOrderReport() {
    return reportService.getPurchaseOrderReport();
}
@GetMapping("/generate")
public ReportResponse generateReport() {
    return reportService.generateReport();
}
}