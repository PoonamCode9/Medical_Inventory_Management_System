package com.medistock.backend.service;

import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public void createNotification(String message, String type) {
        Notification notification = new Notification(message, type);
        notificationRepository.save(notification);
    }

    @Override
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public void checkLowStockAndCreateNotifications() {
        List<Medicine> lowStock = medicineRepository.findLowStockMedicines();
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();

        for (Medicine m : lowStock) {
            String msg = "Alert: Low stock for " + m.getName() + ". Current quantity: " + m.getStockQuantity() + " (Limit: " + m.getMinStockAlert() + ")";
            boolean alreadyNotified = unread.stream().anyMatch(n -> n.getMessage().contains(m.getName()) && "LOW_STOCK".equals(n.getType()));
            if (!alreadyNotified) {
                createNotification(msg, "LOW_STOCK");
            }
        }
    }

    @Override
    public void checkExpiryAndCreateNotifications() {
        // Find batches expiring within next 3 months (90 days)
        List<Inventory> expiringSoon = inventoryRepository.findExpiringSoon(LocalDate.now().plusDays(90));
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();

        for (Inventory i : expiringSoon) {
            String msg = "Alert: Batch " + i.getBatchNumber() + " of " + i.getMedicine().getName() + " expires on " + i.getExpiryDate();
            boolean alreadyNotified = unread.stream().anyMatch(n -> n.getMessage().contains(i.getBatchNumber()) && "EXPIRY".equals(n.getType()));
            if (!alreadyNotified) {
                createNotification(msg, "EXPIRY");
            }
        }
    }
}
