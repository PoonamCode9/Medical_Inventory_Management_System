package com.example.medistock.medistock.service;

import com.example.medistock.medistock.model.Notification;
import com.example.medistock.medistock.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @PostConstruct
    public void initMockData() {
        if (notificationRepository.count() == 0) {
            // Using your class's parameterized constructor: (type, title, message, priority)
            notificationRepository.save(new Notification("low_stock", "Low Stock Alert", "Batch BATCH-PAR-002 is running low (25 left).", "warning"));
            notificationRepository.save(new Notification("low_stock", "Low Stock Alert", "Batch BATCH-ATV-004 is running low (10 left).", "error"));
            notificationRepository.save(new Notification("expiry", "Expiry Warning", "Batch BATCH-SAL-005 is approaching expiry date.", "warning"));
        }
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notification markAsRead(Long id) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found with id: " + id);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
}