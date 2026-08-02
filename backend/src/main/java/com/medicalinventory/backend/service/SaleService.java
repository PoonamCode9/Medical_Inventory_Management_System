package com.medicalinventory.backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.InventoryRepository;
import com.medicalinventory.backend.repository.MedicineRepository;
import com.medicalinventory.backend.repository.UserRepository;

@Service
public class SaleService {

    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final StockLogService stockLogService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public SaleService(
            InventoryRepository inventoryRepository, 
            MedicineRepository medicineRepository, 
            StockLogService stockLogService,
            NotificationService notificationService, UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.medicineRepository = medicineRepository;
        this.stockLogService = stockLogService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public Inventory processSale(Long medicineId, Integer quantityToSell) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        Inventory inventory = inventoryRepository.findByMedicine(medicine)
                .orElseThrow(() -> new RuntimeException("Inventory not found for this medicine"));

        if(quantityToSell == null || quantityToSell < 1) {
            throw new RuntimeException("Sale quantity must be greater than or equal to 1");
        } 

        if (inventory.getQuantity() < quantityToSell) {
            throw new RuntimeException("Insufficient stock! Available: " + inventory.getQuantity());
        }

        int beforeQty = inventory.getQuantity();
        int afterQty = beforeQty - quantityToSell;

        String performedBy = getPerformedBy();

        inventory.setQuantity(afterQty);
        Inventory updatedInventory = inventoryRepository.save(inventory);

        stockLogService.logSale(medicine, quantityToSell, beforeQty, afterQty, performedBy);

        notificationService.createNotification(
            medicine, 
            "MEDICINE_SOLD", 
            quantityToSell + " units of " + medicine.getMedicineName() + " sold", 
            "Push"
        );

        if (afterQty <= 20) {
            notificationService.createNotification(
                medicine, 
                "LOW_STOCK", 
                medicine.getMedicineName() + " stock is running low", 
                "Push"
            );
        }

        return updatedInventory;
    }

    // get performed by (username)
    private String getPerformedBy() {
        Authentication authentication = SecurityContextHolder.getContext(). getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        String performedBy = user.getFullName();
        return performedBy;
    }
}