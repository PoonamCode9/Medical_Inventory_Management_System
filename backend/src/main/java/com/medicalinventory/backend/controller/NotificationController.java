package com.medicalinventory.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.dto.NotificationDTO;
import com.medicalinventory.backend.entity.Notification;
import com.medicalinventory.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/latest")
    public List<NotificationDTO> getLatestNotifications() {
        return notificationService.getLatestNotifications();
    }

    @GetMapping
    public List<NotificationDTO> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/unread")
    public List<NotificationDTO> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification updatedNotification = notificationService.markAsRead(id);
            return ResponseEntity.ok(updatedNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<String> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok("All notifications marked as read");
    }

    @GetMapping("/unread-count")
    public Long getUnreadCount() {
        return notificationService.getUnreadCount();
    }
}
