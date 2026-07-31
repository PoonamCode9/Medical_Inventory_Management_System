package com.example.backend;

import com.example.backend.dto.NotificationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Unified Notification Controller serving Admin, Pharmacist, and Staff roles.
 * Each role has its own base path but the logic is shared.
 */
@RestController
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                   UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // ─── Helper ───────────────────────────────────────────────

    private User findCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── ADMIN ENDPOINTS ──────────────────────────────────────

    @GetMapping("/api/admin/notifications/recent")
    public ResponseEntity<List<NotificationDto>> adminGetRecent(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getRecentNotifications(user.getId(), 5));
    }

    @GetMapping("/api/admin/notifications")
    public ResponseEntity<List<NotificationDto>> adminGetAll(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getAllNotifications(user.getId()));
    }

    @PutMapping("/api/admin/notifications/{id}/read")
    public ResponseEntity<Void> adminMarkRead(@PathVariable Long id, Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/notifications/read-all")
    public ResponseEntity<Void> adminMarkAllRead(Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/admin/notifications/unread-count")
    public ResponseEntity<Map<String, Long>> adminUnreadCount(Authentication auth) {
        User user = findCurrentUser(auth);
        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> resp = new HashMap<>();
        resp.put("count", count);
        return ResponseEntity.ok(resp);
    }

    // ─── PHARMACIST ENDPOINTS ─────────────────────────────────

    @GetMapping("/api/pharmacist/notifications/recent")
    public ResponseEntity<List<NotificationDto>> pharmacistGetRecent(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getRecentNotifications(user.getId(), 5));
    }

    @GetMapping("/api/pharmacist/notifications")
    public ResponseEntity<List<NotificationDto>> pharmacistGetAll(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getAllNotifications(user.getId()));
    }

    @PutMapping("/api/pharmacist/notifications/{id}/read")
    public ResponseEntity<Void> pharmacistMarkRead(@PathVariable Long id, Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/pharmacist/notifications/read-all")
    public ResponseEntity<Void> pharmacistMarkAllRead(Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/pharmacist/notifications/unread-count")
    public ResponseEntity<Map<String, Long>> pharmacistUnreadCount(Authentication auth) {
        User user = findCurrentUser(auth);
        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> resp = new HashMap<>();
        resp.put("count", count);
        return ResponseEntity.ok(resp);
    }

    // ─── STAFF ENDPOINTS ──────────────────────────────────────

    @GetMapping("/api/staff/notifications/recent")
    public ResponseEntity<List<NotificationDto>> staffGetRecent(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getRecentNotifications(user.getId(), 5));
    }

    @GetMapping("/api/staff/notifications")
    public ResponseEntity<List<NotificationDto>> staffGetAll(Authentication auth) {
        User user = findCurrentUser(auth);
        return ResponseEntity.ok(notificationService.getAllNotifications(user.getId()));
    }

    @PutMapping("/api/staff/notifications/{id}/read")
    public ResponseEntity<Void> staffMarkRead(@PathVariable Long id, Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/staff/notifications/read-all")
    public ResponseEntity<Void> staffMarkAllRead(Authentication auth) {
        User user = findCurrentUser(auth);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/staff/notifications/unread-count")
    public ResponseEntity<Map<String, Long>> staffUnreadCount(Authentication auth) {
        User user = findCurrentUser(auth);
        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Long> resp = new HashMap<>();
        resp.put("count", count);
        return ResponseEntity.ok(resp);
    }
}

