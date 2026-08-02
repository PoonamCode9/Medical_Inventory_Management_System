package com.medicalinventory.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.dto.NotificationDTO;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.Notification;
import com.medicalinventory.backend.mapper.NotificationMapper;
import com.medicalinventory.backend.repository.NotificationRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Medicine medicine, String notificationType, String message, String notificationMode) {
        Notification notification = new Notification();

        notification.setMedicine(medicine);
        notification.setNotificationType(notificationType);
        notification.setMessage(message);
        notification.setNotificationMode(notificationMode);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    public List<NotificationDTO> getLatestNotifications() {
        return notificationRepository.findTop5ByOrderByCreatedAtDesc().stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }
    
    public List<NotificationDTO> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc().stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        List<Notification> notifications = notificationRepository.findByIsReadFalse();
        for(Notification notification : notifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    // Trigger Low Stock Notification if quantity <= 20
    public void checkAndTriggerLowStockNotification(Medicine medicine, int currentQuantity) {
        int LOW_STOCK_THRESHOLD = 20;

        if (currentQuantity <= LOW_STOCK_THRESHOLD && currentQuantity >= 0) {
            String message = medicine.getMedicineName() + " stock is running low! Remaining quantity: " + currentQuantity;
            createNotification(medicine, "LOW_STOCK", message, "Push");
        }
    }
}
