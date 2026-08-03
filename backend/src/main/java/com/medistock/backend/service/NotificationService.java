package com.medistock.backend.service;

import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.Notification;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private EmailService emailService;

    // Create notification manually
    public Notification createNotification(
            String title, String message, String type) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository
            .findAllByOrderByCreatedAtDesc();
    }

    // Get unread count
    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    // Mark all as read
    public void markAllAsRead() {
        List<Notification> unread =
            notificationRepository.findByIsReadFalse();
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    // Mark one as read
    public void markAsRead(Long id) {
        Notification notification =
            notificationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Not found!"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    // Delete notification
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // Auto check every hour
    @Scheduled(fixedRate = 3600000)
    public void checkAndCreateAlerts() {
        checkLowStockAlerts();
        checkExpiryAlerts();
    }

    // Check low stock
    private void checkLowStockAlerts() {
    List<Medicine> lowStock =
        medicineRepository.findByQuantityLessThan(10);
    lowStock.forEach(medicine -> {
        if (medicine.getQuantity() == 0) {
            createNotification(
                "Out of Stock Alert!",
                medicine.getName() +
                " is OUT OF STOCK! Please restock immediately!",
                "OUT_OF_STOCK"
            );
            // Send email
            emailService.sendLowStockAlert(
                medicine.getName(),
                medicine.getQuantity()
            );
            } else {
                createNotification(
                "Low Stock Alert!",
                medicine.getName() +
                " is LOW on stock! Current quantity: " +
                medicine.getQuantity(),
                "LOW_STOCK"
            );
            // Send email
            emailService.sendLowStockAlert(
                medicine.getName(),
                medicine.getQuantity()
            );
            }
        });
    }

    // Check expiry
    private void checkExpiryAlerts() {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDays = today.plusDays(30);
        List<Medicine> allMedicines =
            medicineRepository.findAll();
        allMedicines.stream()
            .filter(m -> m.getExpiryDate() != null &&
                m.getExpiryDate().isBefore(thirtyDays) &&
                !m.getExpiryDate().isBefore(today))
            .forEach(medicine -> {
    long daysLeft = today.until(
        medicine.getExpiryDate(),
        java.time.temporal.ChronoUnit.DAYS
    );
    createNotification(
        "Expiry Alert!",
        medicine.getName() +
        " expires in " + daysLeft +
        " days! Expiry date: " +
        medicine.getExpiryDate(),
        "EXPIRY"
    );
    // Send email
    emailService.sendExpiryAlert(
        medicine.getName(),
        medicine.getExpiryDate().toString(),
        daysLeft
    );
});
    }
}