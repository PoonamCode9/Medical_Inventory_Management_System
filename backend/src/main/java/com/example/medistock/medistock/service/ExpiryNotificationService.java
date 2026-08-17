package com.example.medistock.medistock.service;

import com.example.medistock.medistock.model.Inventory;
import com.example.medistock.medistock.model.Notification;
import com.example.medistock.medistock.repository.InventoryRepository;
import com.example.medistock.medistock.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ExpiryNotificationService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public void processExpiryAndStockAlerts() {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        for (Inventory item : inventoryList) {
            // Low Stock Check
            if (item.getQuantity() != null && item.getQuantity() < 10) {
                Notification notif = new Notification();
                notif.setTitle("Low Stock Alert");
                notif.setMessage("Batch " + item.getBatchNumber() + " is running low (" + item.getQuantity() + " left).");
                notificationRepository.save(notif);
            }

            // Expiry Check (within 30 days)
            LocalDate expiry = item.getExpiryDate();
            if (expiry != null && ChronoUnit.DAYS.between(LocalDate.now(), expiry) <= 30) {
                Notification notif = new Notification();
                notif.setTitle("Expiry Warning");
                notif.setMessage("Batch " + item.getBatchNumber() + " expires soon on " + expiry.toString() + ".");
                notificationRepository.save(notif);
            }
        }
    }
}