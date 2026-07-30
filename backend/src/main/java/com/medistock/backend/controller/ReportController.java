package com.medistock.backend.controller;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medistock.backend.dto.ReportDTO;
import com.medistock.backend.dto.ReportRequest;
import com.medistock.backend.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    // ===========================
    // Report History
    // ===========================
    @GetMapping
    public ResponseEntity<List<ReportDTO>> getAllReports() {

        return ResponseEntity.ok(reportService.getAllReports());

    }

    // ===========================
    // Create Report History
    // ===========================
    @PostMapping
    public ResponseEntity<ReportDTO> createReport(
            @RequestBody ReportRequest request) {

        return ResponseEntity.ok(
                reportService.createReport(request));

    }

    // ===========================
    // Delete Report History
    // ===========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(
            @PathVariable Integer id) {

        reportService.deleteReport(id);

        return ResponseEntity.ok("Report Deleted Successfully");

    }

    // ===========================
    // Inventory Report PDF
    // ===========================
    @GetMapping("/inventory/{userId}")
    public ResponseEntity<byte[]> generateInventoryReport(
            @PathVariable Integer userId) {

        ByteArrayOutputStream pdf =
                reportService.generateInventoryReport(userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Inventory_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());

    }

    // ===========================
    // Purchase Report PDF
    // ===========================
    @GetMapping("/purchase/{userId}")
    public ResponseEntity<byte[]> generatePurchaseReport(
            @PathVariable Integer userId) {

        ByteArrayOutputStream pdf =
                reportService.generatePurchaseReport(userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Purchase_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());

    }

    // ===========================
    // Supplier Report PDF
    // ===========================
    @GetMapping("/supplier/{userId}")
    public ResponseEntity<byte[]> generateSupplierReport(
            @PathVariable Integer userId) {

        ByteArrayOutputStream pdf =
                reportService.generateSupplierReport(userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Supplier_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());

    }

    // ===========================
    // Low Stock Report PDF
    // ===========================
    @GetMapping("/low-stock/{userId}")
    public ResponseEntity<byte[]> generateLowStockReport(
            @PathVariable Integer userId) {

        ByteArrayOutputStream pdf =
                reportService.generateLowStockReport(userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Low_Stock_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());

    }

}