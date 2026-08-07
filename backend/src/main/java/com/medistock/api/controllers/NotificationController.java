package com.medistock.api.controllers;

import com.medistock.api.dto.NotificationDTO;
import com.medistock.api.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * GET /api/notifications
     * Returns all notifications for the currently logged-in user (newest first).
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(auth.getName()));
    }

    /**
     * GET /api/notifications/unread-count
     * Returns the count of UNREAD notifications for the badge.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        long count = notificationService.getUnreadCount(auth.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * PUT /api/notifications/{id}/read
     * Marks a single notification as READ.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication auth) {
        try {
            NotificationDTO updated = notificationService.markAsRead(id, auth.getName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/notifications/read-all
     * Marks ALL notifications for the current user as READ.
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(auth.getName());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * DELETE /api/notifications/{id}
     * Dismisses (permanently deletes) a single notification.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> dismiss(@PathVariable Long id, Authentication auth) {
        try {
            notificationService.dismiss(id, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Notification dismissed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/notifications/trigger-scan
     * Manual trigger for testing — generates notifications immediately.
     * Restricted to ADMIN only.
     */
    @PostMapping("/trigger-scan")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> triggerScan() {
        try {
            notificationService.generateExpiryAndLowStockNotifications();
            return ResponseEntity.ok(Map.of("message", "Notification scan triggered successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
