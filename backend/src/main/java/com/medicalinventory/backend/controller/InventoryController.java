package com.medicalinventory.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.dto.RecentMedicineDTO;
import com.medicalinventory.backend.dto.TopMedicineStockDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(inventoryService.getInventoryById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> saveInventory(@RequestBody Inventory inventory) {
        try {
            return ResponseEntity.ok(inventoryService.saveInventory(inventory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody Inventory inventory) {
        try {
            return ResponseEntity.ok(inventoryService.updateInventory(id, inventory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.ok("Inventory deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/available-medicines")
    public List<Medicine> getAvailableMedicines() {
        return inventoryService.getAvailableMedicines();
    }

    @GetMapping("/recent-medicines")
    public List<RecentMedicineDTO> getRecentMedicines() {
        return inventoryService.getRecentMedicines();
    }

    @GetMapping("/top-medicines-stock")
    public List<TopMedicineStockDTO> getTopMedicineStock() {
        return inventoryService.getTopMedicineStock();
    }

    // for report damaged stock logs 
    @PostMapping("/{id}/damaged")
    public ResponseEntity<?> reportDamaged(@PathVariable Long id, @RequestParam Integer quantity, @RequestParam(required = false) String reason) {
        try {
            Inventory updatedInventory = inventoryService.reportDamagedStock(id, quantity, reason);
            return ResponseEntity.ok(updatedInventory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // for remove expired stock and create log
    @PostMapping("/{id}/remove-expired")
    public ResponseEntity<?> removeExpiredStock(@PathVariable Long id) {
        try {
            Inventory inventory = inventoryService.removeExpiredStock(id);
            return ResponseEntity.ok(inventory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
