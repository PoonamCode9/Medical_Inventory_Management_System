package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.entity.User;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final StockLogRepository stockLogRepository;
    private final UserRepository userRepository;
    private final com.medistock.backend.service.NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAllWithDetails();
    }

    @Override
    @Transactional(readOnly = true)
    public Inventory getInventoryByMedicineId(Integer medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + medicineId));
        Inventory inventory = inventoryRepository.findByMedicine(medicine)
                .orElse(null);
        if (inventory == null) {
            inventory = Inventory.builder()
                    .medicine(medicine)
                    .quantity(0)
                    .minimumStock(10)
                    .lastUpdated(LocalDateTime.now())
                    .build();
            inventoryRepository.save(inventory);
        }
        return inventory;
    }

    @Override
    @Transactional
    public Inventory stockIn(Integer medicineId, Integer quantity, String reason, String email) {
        log.info("Stock in request for medicine ID: {} by quantity: {} with reason: {}", medicineId, quantity, reason);
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Stock in quantity must be a positive integer greater than zero.");
        }
        if (reason == null || reason.trim().length() < 10) {
            throw new IllegalArgumentException("Transaction Reason is mandatory and must be at least 10 characters long.");
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        int newQty = oldQty + quantity;
        
        int maxStock = inventory.getMaximumStock() != null ? inventory.getMaximumStock() : 1000;
        if (newQty > maxStock) {
            throw new IllegalArgumentException("Cannot stock in. Total resulting quantity (" + newQty + ") would exceed Maximum Stock limit (" + maxStock + ").");
        }

        inventory.setQuantity(newQty);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = reason.trim();
        logStockMovement(inventory.getMedicine(), email, "STOCK_IN", oldQty, newQty, activeReason);

        notificationService.createNotification(
                null,
                "Stock In Recorded",
                "Stock added for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + "). Quantity added: +" + quantity + ". New stock: " + newQty + " by " + email + ". Reason: " + activeReason,
                "INFO",
                "LOW",
                "INVENTORY",
                inventory.getInventoryId()
        );

        return saved;
    }

    @Override
    @Transactional
    public Inventory stockOut(Integer medicineId, Integer quantity, String reason, String email) {
        log.info("Stock out request for medicine ID: {} by quantity: {} with reason: {}", medicineId, quantity, reason);
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Stock out quantity must be a positive integer greater than zero.");
        }
        if (reason == null || reason.trim().length() < 10) {
            throw new IllegalArgumentException("Transaction Reason is mandatory and must be at least 10 characters long.");
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        if (oldQty < quantity) {
            throw new IllegalArgumentException("Cannot perform Stock Out. Requested quantity (" + quantity + ") exceeds current available stock (" + oldQty + ").");
        }
        int newQty = oldQty - quantity;
        inventory.setQuantity(newQty);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = reason.trim();
        logStockMovement(inventory.getMedicine(), email, "STOCK_OUT", oldQty, newQty, activeReason);

        notificationService.createNotification(
                null,
                "Stock Out Recorded",
                "Stock dispensed for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + "). Quantity dispensed: -" + quantity + ". Remaining stock: " + newQty + " by " + email + ". Reason: " + activeReason,
                "INFO",
                "LOW",
                "INVENTORY",
                inventory.getInventoryId()
        );

        // Trigger Low/Out of Stock alerts
        if (newQty == 0) {
            notificationService.createNotification(
                    null,
                    "Out Of Stock Notification",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" is now out of stock.",
                    "OUT_OF_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        } else if (newQty <= inventory.getMinimumStock()) {
            notificationService.createNotification(
                    null,
                    "Low Stock Warning",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" stock dropped below minimum. Current stock: " + newQty + " (Minimum: " + inventory.getMinimumStock() + ").",
                    "LOW_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        }

        return saved;
    }

    @Override
    @Transactional
    public Inventory adjustStock(Integer medicineId, Integer quantity, Integer minimumStock, Integer maximumStock, String reason, String email) {
        log.info("Stock adjustment request for medicine ID: {} quantity: {} minimumStock: {} maximumStock: {} reason: {}", medicineId, quantity, minimumStock, maximumStock, reason);
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("Inventory Quantity must be greater than or equal to zero.");
        }
        if (minimumStock == null || minimumStock <= 0) {
            throw new IllegalArgumentException("Minimum Buffer level must be greater than zero.");
        }
        if (maximumStock == null || maximumStock <= minimumStock) {
            throw new IllegalArgumentException("Maximum Stock limit must always be strictly greater than Minimum Buffer level.");
        }
        if (quantity > maximumStock) {
            throw new IllegalArgumentException("Inventory Quantity (" + quantity + ") cannot exceed Maximum Stock limit (" + maximumStock + ").");
        }
        if (reason == null || reason.trim().length() < 10) {
            throw new IllegalArgumentException("Transaction Reason is mandatory and must be at least 10 characters long.");
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        inventory.setQuantity(quantity);
        inventory.setMinimumStock(minimumStock);
        inventory.setMaximumStock(maximumStock);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = reason.trim();
        String actionType = "ADJUST";
        if (oldQty != quantity) {
            actionType = quantity > oldQty ? "BUFFER_INCREASE" : "BUFFER_DECREASE";
        }
        logStockMovement(inventory.getMedicine(), email, actionType, oldQty, quantity, activeReason);

        notificationService.createNotification(
                null,
                "Stock Adjusted",
                "Stock adjusted for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + ") to " + quantity + " (Previous: " + oldQty + ") by " + email + ". Reason: " + activeReason,
                "INFO",
                "LOW",
                "INVENTORY",
                inventory.getInventoryId()
        );

        if (quantity == 0) {
            notificationService.createNotification(
                    null,
                    "Out Of Stock Notification",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" is now out of stock.",
                    "OUT_OF_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        } else if (quantity <= minimumStock) {
            notificationService.createNotification(
                    null,
                    "Low Stock Warning",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" stock is low. Current stock: " + quantity + " (Minimum: " + minimumStock + ").",
                    "LOW_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        }

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockLog> getStockLogs() {
        return stockLogRepository.findAll();
    }

    private void logStockMovement(Medicine medicine, String email, String action, int oldQty, int newQty, String reason) {
        User user = userRepository.findByEmail(email).orElse(null);
        StockLog logEntry = StockLog.builder()
                .medicine(medicine)
                .user(user)
                .action(action)
                .oldQuantity(oldQty)
                .newQuantity(newQty)
                .reason(reason)
                .updatedAt(LocalDateTime.now())
                .build();
        stockLogRepository.save(logEntry);
    }
}
