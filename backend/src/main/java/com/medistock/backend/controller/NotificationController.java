package com.medistock.backend.controller;

import com.medistock.backend.model.Notification;
import com.medistock.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "${app.frontend.url}"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(
            notificationService.getAllNotifications()
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(
            Map.of("count",
                notificationService.getUnreadCount())
        );
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<String> markAllRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok("All marked as read!");
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markRead(
            @PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Marked as read!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok("Deleted!");
    }

    @PostMapping("/generate-alerts")
    public ResponseEntity<String> generateAlerts() {
        notificationService.checkAndCreateAlerts();
        return ResponseEntity.ok(
            "Alerts generated successfully!"
        );
    }
}