package com.medical.om.om_backend.controller;

import com.medical.om.om_backend.entity.Suppliers;
import com.medical.om.om_backend.repository.InventoryRepository;
import com.medical.om.om_backend.repository.MedicineRepository;
import com.medical.om.om_backend.repository.SupplierRepository;
import com.medical.om.om_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/pharmacy")
public class Pharmacycontroller {
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final DashboardService dashboardService;

    public Pharmacycontroller(MedicineRepository medicineRepository, 
                              InventoryRepository inventoryRepository,
                              SupplierRepository supplierRepository,
                              DashboardService dashboardService) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<?>> getMedicines() {
        return ResponseEntity.ok((medicineRepository.findAll()));
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<?>> getInventory() {
        return ResponseEntity.ok((inventoryRepository.findAll()));
    }

    @GetMapping("/suppliers")
    public ResponseEntity<List<Suppliers>> getSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(dashboardService.getCommonStats());
    }
}
