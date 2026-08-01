package com.medical.om.om_backend.controller;

import com.medical.om.om_backend.entity.Suppliers;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import com.medical.om.om_backend.service.DashboardService;
import com.medical.om.om_backend.service.ExpiryService;
import com.medical.om.om_backend.service.InventoryCleanupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/pharmacy")
public class Pharmacycontroller {
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final DashboardService dashboardService;
    private final ExpiryService expiryService;
    private final InventoryCleanupService cleanupService;

    public Pharmacycontroller(MedicineRepository medicineRepository, 
                              InventoryRepository inventoryRepository,
                              SupplierRepository supplierRepository,
                              DashboardService dashboardService,
                              ExpiryService expiryService,
                              InventoryCleanupService cleanupService) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.dashboardService = dashboardService;
        this.expiryService = expiryService;
        this.cleanupService = cleanupService;
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<?>> getMedicines() {
        return ResponseEntity.ok((medicineRepository.findAll()));
    }

    @GetMapping("/medicines/search")
    public ResponseEntity<List<?>> searchMedicines(@RequestParam("q") String q) {
        return ResponseEntity.ok(medicineRepository.search(q));
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<?>> getInventory() {
        cleanupService.cleanup();
        return ResponseEntity.ok((inventoryRepository.findAll()));
    }

    @GetMapping("/inventory/search")
    public ResponseEntity<List<?>> searchInventory(@RequestParam("q") String q) {
        return ResponseEntity.ok(inventoryRepository.search(q));
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<Suppliers>> getSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @GetMapping("/suppliers/search")
    public ResponseEntity<List<Suppliers>> searchSuppliers(@RequestParam("q") String q) {
        return ResponseEntity.ok(supplierRepository.search(q));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(dashboardService.getCommonStats());
    }

    @GetMapping("/expiry")
    public ResponseEntity<?> getExpiry(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(expiryService.getExpirySummary(days));
    }
}
