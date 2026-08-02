package com.medicalinventory.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.service.SaleService;

@RestController
@RequestMapping("/api/sales")
public class SaleController {
    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public ResponseEntity<?> sellMedicine(@RequestParam Long medicineId,  @RequestParam Integer quantity) {
        try {
            Inventory updatedInventory = saleService.processSale(medicineId, quantity);
            return ResponseEntity.ok(updatedInventory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}