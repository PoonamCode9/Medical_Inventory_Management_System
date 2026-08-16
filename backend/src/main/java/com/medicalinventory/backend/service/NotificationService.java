package com.medicalinventory.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicalinventory.backend.dto.NotificationDTO;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.Notification;
import com.medicalinventory.backend.entity.SystemSettings;
import com.medicalinventory.backend.mapper.NotificationMapper;
import com.medicalinventory.backend.repository.NotificationRepository;
import com.medicalinventory.backend.repository.SystemSettingsRepository;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final SystemSettingsRepository systemSettingsRepository;

    @Value("${app.notification.admin-email:${spring.mail.username:admin@pharmacy.com}}")
    private String adminEmail;

    public NotificationService(NotificationRepository notificationRepository, EmailService emailService, SystemSettingsRepository systemSettingsRepository) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    @Transactional
    public Notification createNotification(Medicine medicine, String notificationType, String message,
            String notificationMode) {
        String finalMode = (notificationMode != null && !notificationMode.isBlank()) ? notificationMode : "Push";

        Notification notification = new Notification();
        notification.setMedicine(medicine);
        notification.setNotificationType(notificationType);
        notification.setMessage(message);
        notification.setNotificationMode(finalMode);
        notification.setIsRead(false);

        Notification savedNotification = null;

        // Mode "Push" or "Both" (save in DB)
        if ("Push".equalsIgnoreCase(finalMode) || "Both".equalsIgnoreCase(finalMode)) {
            savedNotification = notificationRepository.save(notification);
        }

        // Mode "Email" or "Both" (send email)
        if ("Email".equalsIgnoreCase(finalMode) || "Both".equalsIgnoreCase(finalMode)) {
            try {
                String subject = "[MediStock Alert] " + notificationType;
                emailService.sendEmail(adminEmail, subject, message);
            } catch (Exception e) {
                System.err.println("Email dispatch error: " + e.getMessage());
            }
        }

        return savedNotification != null ? savedNotification : notification;
    }

    public List<NotificationDTO> getLatestNotifications() {
        return notificationRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc()
                .stream()
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> notifications = notificationRepository.findByIsReadFalse();
        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }
        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void checkAndTriggerLowStockNotification(Medicine medicine, int currentQuantity) {
        int threshold = systemSettingsRepository.findById(1L)
            .map(SystemSettings::getLowStockThreshold)
            .orElse(10);

        if (currentQuantity <= threshold && currentQuantity >= 0) {
            String message = medicine.getMedicineName() + " stock is running low! Remaining quantity: " + currentQuantity;
            createNotification(medicine, "LOW_STOCK", message, "Both");
        }
    }

    @Transactional
    public void deleteReadNotifications() {
        List<Notification> readNotifications = notificationRepository.findByIsReadTrue();
        if (!readNotifications.isEmpty()) {
            notificationRepository.deleteAll(readNotifications);
        }
    }

    public void deleteNotificationById(Long id) {
        notificationRepository.deleteById(id);
    }
}