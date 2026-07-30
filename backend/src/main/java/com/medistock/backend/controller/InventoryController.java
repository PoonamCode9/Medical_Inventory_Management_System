package com.medistock.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.dto.Inventory;
import com.medistock.backend.service.InventoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    // Get All Inventory
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // Get Inventory By Id
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    // Add Inventory
    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory dto) {
        return new ResponseEntity<>(
                inventoryService.addInventory(dto),
                HttpStatus.CREATED
        );
    }

    // Update Inventory
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Integer id,
            @RequestBody Inventory dto) {

        return ResponseEntity.ok(
                inventoryService.updateInventory(id, dto)
        );
    }

    // Delete Inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInventory(@PathVariable Integer id) {

        inventoryService.deleteInventory(id);

        return ResponseEntity.ok("Inventory deleted successfully.");
    }

    // Search Inventory
    @GetMapping("/search")
    public ResponseEntity<List<Inventory>> searchInventory(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                inventoryService.searchInventory(keyword)
        );
    }
}