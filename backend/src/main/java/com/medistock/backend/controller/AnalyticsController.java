package com.medistock.backend.controller;

import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.model.Medicine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    // Complete dashboard analytics
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        List<Medicine> allMedicines = medicineRepository.findAll();

        // Stock distribution
        Map<String, Long> stockDistribution = new HashMap<>();
        stockDistribution.put("IN_STOCK",
            allMedicines.stream()
                .filter(m -> "IN_STOCK".equals(m.getStatus()))
                .count());
        stockDistribution.put("LOW_STOCK",
            allMedicines.stream()
                .filter(m -> "LOW_STOCK".equals(m.getStatus()))
                .count());
        stockDistribution.put("OUT_OF_STOCK",
            allMedicines.stream()
                .filter(m -> "OUT_OF_STOCK".equals(m.getStatus()))
                .count());

        // Category wise medicines
        Map<String, Long> categoryWise = allMedicines.stream()
            .filter(m -> m.getCategory() != null
                && !m.getCategory().isEmpty())
            .collect(Collectors.groupingBy(
                Medicine::getCategory,
                Collectors.counting()
            ));

        // Supplier wise medicines
        Map<String, Long> supplierWise = allMedicines.stream()
            .filter(m -> m.getSupplier() != null
                && !m.getSupplier().isEmpty())
            .collect(Collectors.groupingBy(
                Medicine::getSupplier,
                Collectors.counting()
            ));

        // Expiry stats
        LocalDate today = LocalDate.now();
        LocalDate thirtyDays = today.plusDays(30);

        long expiringSoon = allMedicines.stream()
            .filter(m -> m.getExpiryDate() != null
                && !m.getExpiryDate().isBefore(today)
                && m.getExpiryDate().isBefore(thirtyDays))
            .count();

        long alreadyExpired = allMedicines.stream()
            .filter(m -> m.getExpiryDate() != null
                && m.getExpiryDate().isBefore(today))
            .count();

        // Purchase order stats
        Map<String, Long> purchaseStats = new HashMap<>();
        purchaseStats.put("PENDING",
            purchaseOrderRepository
                .findByStatus("PENDING").stream().count());
        purchaseStats.put("DELIVERED",
            purchaseOrderRepository
                .findByStatus("DELIVERED").stream().count());
        purchaseStats.put("CANCELLED",
            purchaseOrderRepository
                .findByStatus("CANCELLED").stream().count());

        // Summary stats
        analytics.put("totalMedicines", allMedicines.size());
        analytics.put("totalSuppliers",
            supplierRepository.findAll().size());
        analytics.put("stockDistribution", stockDistribution);
        analytics.put("categoryWise", categoryWise);
        analytics.put("supplierWise", supplierWise);
        analytics.put("expiringSoon", expiringSoon);
        analytics.put("alreadyExpired", alreadyExpired);
        analytics.put("purchaseStats", purchaseStats);
        analytics.put("totalStockLogs",
            stockLogRepository.findAll().size());

        return ResponseEntity.ok(analytics);
    }
}