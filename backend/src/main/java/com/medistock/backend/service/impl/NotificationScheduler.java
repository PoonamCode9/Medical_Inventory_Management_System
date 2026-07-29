package com.medistock.backend.service.impl;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.Notification;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    // Run every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void runDailyInventoryChecks() {
        log.info("Starting scheduled daily inventory checks for low stock and drug expiration...");

        LocalDate today = LocalDate.now();
        List<Medicine> medicines = medicineRepository.findAll();
        List<Notification> existingNotifications = notificationRepository.findAll();

        // 1. Check Expiry
        for (Medicine med : medicines) {
            LocalDate exp = med.getExpiryDate();
            if (exp == null) continue;

            long days = ChronoUnit.DAYS.between(today, exp);
            String title = null;
            String message = null;
            String type = null;
            String priority = null;

            if (days < 0) {
                title = "Medicine Expired";
                message = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expired on " + exp + ".";
                type = "EXPIRED";
                priority = "HIGH";
            } else if (days <= 30) {
                title = "Critical Expiry Warning";
                message = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expires in " + days + " days (Critical).";
                type = "EXPIRY_ALERT";
                priority = "HIGH";
            } else if (days <= 60) {
                title = "Batch Expiring Soon";
                message = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") expires in " + days + " days (Expiring Soon).";
                type = "EXPIRY_ALERT";
                priority = "MEDIUM";
            }

            if (type != null) {
                final Integer medId = med.getMedicineId();
                final String newMsg = message;
                final String newTitle = title;
                final String newPriority = priority;
                final String newType = type;

                Notification existing = existingNotifications.stream()
                        .filter(n -> "EXPIRY".equalsIgnoreCase(n.getRelatedModule()) && medId.equals(n.getRelatedEntityId()))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    if (!newMsg.equals(existing.getMessage())) {
                        existing.setMessage(newMsg);
                        existing.setTitle(newTitle);
                        existing.setPriority(newPriority);
                        existing.setType(newType);
                        existing.setCreatedAt(LocalDateTime.now());
                        existing.setIsRead(false);
                        notificationRepository.save(existing);
                    }
                } else {
                    notificationService.createNotification(null, newTitle, newMsg, newType, newPriority, "EXPIRY", medId);
                }
            }
        }

        // 2. Check Low Stock
        List<Inventory> inventoryList = inventoryRepository.findAll();
        for (Inventory inv : inventoryList) {
            int qty = inv.getQuantity();
            int minStock = inv.getMinimumStock() != null ? inv.getMinimumStock() : 10;
            Medicine med = inv.getMedicine();

            if (med == null) continue;

            String title = null;
            String message = null;
            String type = null;
            String priority = null;

            if (qty == 0) {
                title = "Out Of Stock Alert";
                message = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") is now out of stock.";
                type = "OUT_OF_STOCK";
                priority = "HIGH";
            } else if (qty <= minStock) {
                title = "Low Stock Alert";
                message = "Medicine \"" + med.getMedicineName() + "\" (Batch: " + med.getBatchNumber() + ") stock has fallen below the minimum stock level. Current quantity: " + qty;
                type = "LOW_STOCK";
                priority = "HIGH";
            }

            if (type != null) {
                final Integer invId = inv.getInventoryId();
                final String newMsg = message;
                final String newTitle = title;
                final String newPriority = priority;
                final String newType = type;

                Notification existing = existingNotifications.stream()
                        .filter(n -> "INVENTORY".equalsIgnoreCase(n.getRelatedModule()) && invId.equals(n.getRelatedEntityId()))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    if (!newMsg.equals(existing.getMessage())) {
                        existing.setMessage(newMsg);
                        existing.setTitle(newTitle);
                        existing.setPriority(newPriority);
                        existing.setType(newType);
                        existing.setCreatedAt(LocalDateTime.now());
                        existing.setIsRead(false);
                        notificationRepository.save(existing);
                    }
                } else {
                    notificationService.createNotification(null, newTitle, newMsg, newType, newPriority, "INVENTORY", invId);
                }
            }
        }

        log.info("Scheduled daily inventory checks completed.");
    }
}
