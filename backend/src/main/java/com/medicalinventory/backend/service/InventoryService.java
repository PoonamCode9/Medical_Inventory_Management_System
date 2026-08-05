package com.medicalinventory.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.medicalinventory.backend.dto.RecentMedicineDTO;
import com.medicalinventory.backend.dto.TopMedicineStockDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.MedicineRepository;
import com.medicalinventory.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final NotificationService notificationService;
    private final StockLogService stockLogService;
    private final UserRepository userRepository;

    public InventoryService(InventoryRepository inventoryRepository, MedicineRepository medicineRepository,NotificationService notificationService, StockLogService stockLogService, UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.medicineRepository = medicineRepository;
        this.notificationService = notificationService;
        this.stockLogService = stockLogService;
        this.userRepository = userRepository;
    }

    // Get all inventory
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // Get inventory by id
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("inventory not found"));
    }

    // Add inventory (save)
    public Inventory saveInventory(Inventory inventory) {
        Medicine medicine = medicineRepository.findById(inventory.getMedicine().getMedicineId()).orElseThrow(() -> new RuntimeException("Medicine not found"));

        if(inventoryRepository.existsByMedicine(medicine)) {
            throw new RuntimeException("Inventory already exists for this medicine");
        }

        inventory.setMedicine(medicine);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory savedInventory = inventoryRepository.save(inventory);

        String performedBy = getPerformedBy();

        stockLogService.createLog(
            savedInventory.getMedicine(),
            savedInventory.getQuantity(),
            "PURCHASE",
            "Initial inventory added",
            0,
            savedInventory.getQuantity(),
            performedBy
        );

        notificationService.createNotification(savedInventory.getMedicine(), "INVENTORY_ADDED",  savedInventory.getMedicine().getMedicineName() + " inventory added successfully", "Push");

        //  Low Stock Check Trigger
        notificationService.checkAndTriggerLowStockNotification(savedInventory.getMedicine(), savedInventory.getQuantity());

        return savedInventory;
    }

    // update inventory
    public Inventory updateInventory(Long id, Inventory inventory) {
        Inventory existingInventory = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("inventory not found"));
        
        int previousQuantity = existingInventory.getQuantity();
        int newQuantity = inventory.getQuantity();
        int quantityChanged = newQuantity - previousQuantity;
        existingInventory.setQuantity(newQuantity);

        existingInventory.setLastUpdated(LocalDateTime.now());
        Inventory updatedInventory =  inventoryRepository.save(existingInventory);

        String performedBy = getPerformedBy();

        stockLogService.createLog(
            updatedInventory.getMedicine(),
            quantityChanged,
            "ADJUSTMENT",
            "Inventory quantity updated",
            previousQuantity,
            newQuantity,
            performedBy
        );
        
        notificationService.createNotification(updatedInventory.getMedicine(), "INVENTORY_UPDATED",  updatedInventory.getMedicine().getMedicineName() + " inventory updated successfully", "Push");

        // Low Stock Check Trigger
        notificationService.checkAndTriggerLowStockNotification(updatedInventory.getMedicine(), updatedInventory.getQuantity());

        return updatedInventory;
    }

    // delete inventory
    @Transactional 
    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found"));

        Medicine medicine = inventory.getMedicine();
        String medicineName = inventory.getMedicine().getMedicineName();
        int quantity = inventory.getQuantity();

        inventoryRepository.delete(inventory);

        String performedBy = getPerformedBy();

        stockLogService.createLog(
            medicine,
            -quantity,
            "DELETE",
            "Inventory record deleted",
            quantity,
            0,
            performedBy
        );
        
        notificationService.createNotification(medicine, "INVENTORY_DELETED",  medicineName + " inventory record deleted successfully", "Push");
    }

    // get all available medicines 
    public List<Medicine> getAvailableMedicines() {
        List<Medicine> medicines = medicineRepository.findAll();
        List<Inventory> inventories = inventoryRepository.findAll();
        List<Long> inventoryMedicinesIds = inventories.stream().map(i -> i.getMedicine().getMedicineId()).toList();

        return medicines.stream().filter(m -> !inventoryMedicinesIds.contains(m.getMedicineId())).toList();
    }

    // get 5 recent inventory updates medicines
    public List<RecentMedicineDTO> getRecentMedicines() {
        return inventoryRepository.getRecentMedicines(PageRequest.of(0, 5));
    }

    public List<TopMedicineStockDTO> getTopMedicineStock() {
        return inventoryRepository.getTopMedicineStock(PageRequest.of(0, 6));
    }

    // create stock log when report damaged -
    @Transactional
    public Inventory reportDamagedStock(Long inventoryId, Integer damagedQuantity, String reason) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        if (inventory.getQuantity() < damagedQuantity) {
            throw new RuntimeException("Damaged quantity exceeds current stock!");
        }

        int previousQty = inventory.getQuantity();
        int newQty = previousQty - damagedQuantity;

        inventory.setQuantity(newQty);
        Inventory updatedInventory = inventoryRepository.save(inventory);

        String performedBy = getPerformedBy();

        stockLogService.logDamagedRemoval(
            inventory.getMedicine(), 
            damagedQuantity, 
            previousQty, 
            newQty, 
            reason != null && !reason.isBlank() ? reason : "Physical Damage / Broken", 
            performedBy
        );

        notificationService.createNotification(
            inventory.getMedicine(),
            "STOCK_DAMAGED",
            damagedQuantity + " units of " + inventory.getMedicine().getMedicineName() + " reported damaged",
            "Push"
        );

        //  Low Stock Check Trigger
        notificationService.checkAndTriggerLowStockNotification(inventory.getMedicine(), newQty);

        return updatedInventory;
    }

    // Remove expired stock and create log
    @Transactional
    public Inventory removeExpiredStock(Long inventoryId) {

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        if (inventory.getQuantity() <= 0) {
            throw new RuntimeException("Stock already removed.");
        }

        int beforeQty = inventory.getQuantity();

        inventory.setQuantity(0);

        Inventory updatedInventory = inventoryRepository.save(inventory);

        String performedBy = getPerformedBy();

        stockLogService.logExpiryRemoval(
                inventory.getMedicine(),
                beforeQty,
                beforeQty,
                0,
                performedBy
        );

        notificationService.createNotification(
                inventory.getMedicine(),
                "EXPIRED_STOCK",
                inventory.getMedicine().getMedicineName()
                        + " expired stock removed successfully",
                "Both"
        );

        // Low Stock Check Trigger
        notificationService.checkAndTriggerLowStockNotification(inventory.getMedicine(), 0);

        return updatedInventory;
    }

    // get performed by (username)-
    private String getPerformedBy() {
        Authentication authentication = SecurityContextHolder.getContext(). getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        String performedBy = user.getFullName();
        return performedBy;
    }
}


