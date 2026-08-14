package com.medicalinventory.controller;

import com.medicalinventory.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@CrossOrigin
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/medicine")
    public ResponseEntity<byte[]> downloadMedicineReport() {

        byte[] pdf = reportService.generateMedicineInventoryReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Medicine_Inventory_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/expiry")
    public ResponseEntity<byte[]> downloadExpiryReport() {

        byte[] pdf = reportService.generateExpiryReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Medicine_Expiry_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/stock")
    public ResponseEntity<byte[]> downloadStockReport() {

        byte[] pdf = reportService.generateStockReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Stock_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/stock-transactions")
    public ResponseEntity<byte[]> downloadStockTransactionReport() {

        byte[] pdf = reportService.generateStockTransactionReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Stock_Transaction_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/purchase-orders")
    public ResponseEntity<byte[]> downloadPurchaseOrderReport() {

        byte[] pdf = reportService.generatePurchaseOrderReport();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Purchase_Order_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}