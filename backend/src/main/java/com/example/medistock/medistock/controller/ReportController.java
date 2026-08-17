package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.Inventory;
import com.example.medistock.medistock.model.Medicine;
import com.example.medistock.medistock.model.Supplier;
import com.example.medistock.medistock.repository.InventoryRepository;
import com.example.medistock.medistock.repository.MedicineRepository;
import com.example.medistock.medistock.repository.PurchaseOrderRepository;
import com.example.medistock.medistock.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ReportController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMedicines", medicineRepository.count());
        summary.put("totalSuppliers", supplierRepository.count());
        summary.put("totalBatches", inventoryRepository.count());
        summary.put("totalPurchaseOrders", purchaseOrderRepository.count());
        summary.put("status", "Operational");
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());
        stats.put("totalBatches", inventoryRepository.count());
        stats.put("totalPurchaseOrders", purchaseOrderRepository.count());

        long lowStockCount = inventoryRepository.findAll().stream()
                .filter(i -> i.getQuantity() != null && i.getQuantity() <= 20)
                .count();
        stats.put("lowStockCount", lowStockCount);

        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(30);
        long expiringSoonCount = inventoryRepository.findAll().stream()
                .filter(i -> i.getExpiryDate() != null && !i.getExpiryDate().isBefore(today) && !i.getExpiryDate().isAfter(threshold))
                .count();
        stats.put("expiringSoonCount", expiringSoonCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/export/{type}")
    public ResponseEntity<byte[]> exportCSV(@PathVariable String type) {
        StringBuilder csv = new StringBuilder();
        String filename = "report.csv";

        if ("inventory-csv".equalsIgnoreCase(type)) {
            filename = "inventory_report_" + LocalDate.now() + ".csv";
            csv.append("Medicine Name,Category,Price,Total Stock,Status\n");
            List<Medicine> meds = medicineRepository.findAll();
            for (Medicine m : meds) {
                String cat = m.getCategory() != null ? m.getCategory().getName() : "General";
                csv.append("\"").append(m.getMedicineName()).append("\",\"")
                        .append(cat).append("\",")
                        .append(m.getPrice()).append(",")
                        .append(100).append(",")
                        .append("IN_STOCK\n");
            }
        } else if ("expiry-csv".equalsIgnoreCase(type)) {
            filename = "expiry_report_" + LocalDate.now() + ".csv";
            csv.append("Medicine Name,Batch Number,Quantity,Expiry Date,Status\n");
            List<Inventory> batches = inventoryRepository.findAll();
            for (Inventory b : batches) {
                String med = b.getMedicine() != null ? b.getMedicine().getMedicineName() : "Medicine";
                csv.append("\"").append(med).append("\",\"")
                        .append(b.getBatchNumber()).append("\",")
                        .append(b.getQuantity()).append(",")
                        .append(b.getExpiryDate()).append(",")
                        .append(b.getStockStatus()).append("\n");
            }
        } else if ("supplier-csv".equalsIgnoreCase(type)) {
            filename = "supplier_report_" + LocalDate.now() + ".csv";
            csv.append("Supplier Name,Email,Contact Number,Rating\n");
            List<Supplier> sups = supplierRepository.findAll();
            for (Supplier s : sups) {
                csv.append("\"").append(s.getSupplierName()).append("\",\"")
                        .append(s.getEmail() != null ? s.getEmail() : "").append("\",\"")
                        .append(s.getContactNumber() != null ? s.getContactNumber() : "").append("\",")
                        .append(s.getPerformanceRating() != null ? s.getPerformanceRating() : 5.0).append("\n");
            }
        } else {
            csv.append("Data Export\n");
        }

        byte[] bytes = csv.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}