package com.MediStock.app.controllers;

import com.MediStock.app.dto.InventoryRequest;
import com.MediStock.app.dto.InventoryResponse;
import com.MediStock.app.dto.InventorySummaryResponse;
import com.MediStock.app.services.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {

        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{batchId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<InventoryResponse> getInventoryById(
            @PathVariable Long batchId) {

        return ResponseEntity.ok(
                inventoryService.getInventoryById(batchId));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<InventorySummaryResponse> getInventorySummary() {

        return ResponseEntity.ok(
                inventoryService.getInventorySummary());
    }

    @GetMapping("/search/medicine")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<InventoryResponse>> searchByMedicine(
            @RequestParam String name) {

        return ResponseEntity.ok(
                inventoryService.searchByMedicineName(name));
    }

    @GetMapping("/search/category")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<List<InventoryResponse>> searchByCategory(
            @RequestParam String category) {

        return ResponseEntity.ok(
                inventoryService.searchByCategory(category));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST','STAFF')")
    public ResponseEntity<InventoryResponse> addInventory(
            @RequestBody InventoryRequest request) {

        return new ResponseEntity<>(
                inventoryService.addInventory(request),
                HttpStatus.CREATED);
    }

    @PutMapping("/{batchId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long batchId,
            @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(
                inventoryService.updateInventory(batchId, request));
    }

    @DeleteMapping("/{batchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInventory(
            @PathVariable Long batchId) {

        inventoryService.deleteInventory(batchId);

        return ResponseEntity.ok("Inventory batch deleted successfully.");
    }
}