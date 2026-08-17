package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.repository.InventoryRepository;
import com.example.medistock.medistock.repository.MedicineRepository;
import com.example.medistock.medistock.repository.PurchaseOrderRepository;
import com.example.medistock.medistock.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class AnalyticsController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @GetMapping
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
}