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
        if (quantity <= 0) {
            throw new IllegalArgumentException("Stock in quantity must be positive. Provided: " + quantity);
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        int newQty = oldQty + quantity;
        
        int maxStock = inventory.getMaximumStock() != null ? inventory.getMaximumStock() : 1000;
        if (newQty > maxStock) {
            throw new IllegalArgumentException("Cannot stock in. Total quantity (" + newQty + ") would exceed maximum stock limit (" + maxStock + ").");
        }

        inventory.setQuantity(newQty);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = (reason != null && !reason.trim().isEmpty()) ? reason : "Stock Replenishment";
        logStockMovement(inventory.getMedicine(), email, "STOCK_IN", oldQty, newQty, activeReason);

        notificationService.createNotification(
                null,
                "Stock In Recorded",
                "Stock added for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + "). Quantity added: " + quantity + ". New stock: " + newQty + " by " + email + ". Reason: " + activeReason,
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
        if (quantity <= 0) {
            throw new IllegalArgumentException("Stock out quantity must be positive. Provided: " + quantity);
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        if (oldQty < quantity) {
            throw new IllegalArgumentException("Insufficient inventory stock quantity. Current stock: " + oldQty + ", requested Stock Out: " + quantity);
        }
        int newQty = oldQty - quantity;
        inventory.setQuantity(newQty);
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = (reason != null && !reason.trim().isEmpty()) ? reason : "Stock Dispensation";
        logStockMovement(inventory.getMedicine(), email, "STOCK_OUT", oldQty, newQty, activeReason);

        notificationService.createNotification(
                null,
                "Stock Out Recorded",
                "Stock dispensed for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + "). Quantity dispensed: " + quantity + ". Remaining stock: " + newQty + " by " + email + ". Reason: " + activeReason,
                "INFO",
                "LOW",
                "INVENTORY",
                inventory.getInventoryId()
        );

        // Trigger Low/Out of Stock alerts
        if (newQty == 0) {
            notificationService.createNotification(
                    null,
                    "Out Of Stock Alert",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" is now out of stock.",
                    "OUT_OF_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        } else if (newQty <= inventory.getMinimumStock()) {
            notificationService.createNotification(
                    null,
                    "Low Stock Alert",
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
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative. Provided: " + quantity);
        }
        if (minimumStock != null && minimumStock < 0) {
            throw new IllegalArgumentException("Minimum stock limit cannot be negative.");
        }
        if (maximumStock != null && maximumStock < 0) {
            throw new IllegalArgumentException("Maximum stock limit cannot be negative.");
        }
        if (minimumStock != null && maximumStock != null && minimumStock > maximumStock) {
            throw new IllegalArgumentException("Minimum Stock limit (" + minimumStock + ") cannot exceed Maximum Stock limit (" + maximumStock + ").");
        }
        if (maximumStock != null && quantity > maximumStock) {
            throw new IllegalArgumentException("Stock quantity (" + quantity + ") cannot exceed Maximum Stock limit (" + maximumStock + ").");
        }

        Inventory inventory = getInventoryByMedicineId(medicineId);
        int oldQty = inventory.getQuantity();
        inventory.setQuantity(quantity);
        if (minimumStock != null) {
            inventory.setMinimumStock(minimumStock);
        }
        if (maximumStock != null) {
            inventory.setMaximumStock(maximumStock);
        }
        inventory.setLastUpdated(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        String activeReason = (reason != null && !reason.trim().isEmpty()) ? reason : "Inventory Stock Reconciliation";
        logStockMovement(inventory.getMedicine(), email, "ADJUST", oldQty, quantity, activeReason);

        notificationService.createNotification(
                null,
                "Stock Adjusted",
                "Stock adjusted for medicine \"" + inventory.getMedicine().getMedicineName() + "\" (Batch: " + inventory.getMedicine().getBatchNumber() + ") to " + quantity + " (Previous: " + oldQty + ") by " + email + ". Reason: " + activeReason,
                "INFO",
                "LOW",
                "INVENTORY",
                inventory.getInventoryId()
        );

        int threshold = minimumStock != null ? minimumStock : (inventory.getMinimumStock() != null ? inventory.getMinimumStock() : 10);
        if (quantity == 0) {
            notificationService.createNotification(
                    null,
                    "Out Of Stock Alert",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" is now out of stock.",
                    "OUT_OF_STOCK",
                    "HIGH",
                    "INVENTORY",
                    inventory.getInventoryId()
            );
        } else if (quantity <= threshold) {
            notificationService.createNotification(
                    null,
                    "Low Stock Alert",
                    "Medicine \"" + inventory.getMedicine().getMedicineName() + "\" stock is low. Current stock: " + quantity + " (Minimum: " + threshold + ").",
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
