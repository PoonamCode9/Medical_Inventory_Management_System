package com.medistock.backend.controller;

import com.medistock.backend.model.Notification;
import com.medistock.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.medistock.backend.service.EmailService emailService;

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        // Run checks first
        notificationService.checkLowStockAndCreateNotifications();
        notificationService.checkExpiryAndCreateNotifications();
        return ResponseEntity.ok(notificationService.getUnreadNotifications());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok("All notifications marked as read");
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/test-email")
    public ResponseEntity<?> sendTestEmail() {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.medistock.backend.config.UserDetailsImpl) {
            com.medistock.backend.config.UserDetailsImpl userDetails = 
                (com.medistock.backend.config.UserDetailsImpl) auth.getPrincipal();
            String email = userDetails.getUsername();
            emailService.sendAlertEmail(email, "LOW_STOCK", "This is a verification test email from your MediStock system. Email notifications are fully configured and functional!");
            return ResponseEntity.ok(java.util.Map.of("message", "Test email alert successfully triggered to: " + email));
        }
        return ResponseEntity.badRequest().body(java.util.Map.of("message", "Unable to determine current logged-in user email"));
    }
}
