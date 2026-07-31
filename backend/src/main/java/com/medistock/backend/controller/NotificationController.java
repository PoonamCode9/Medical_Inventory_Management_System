package com.medistock.backend.controller;

import com.medistock.backend.service.ExpiryNotificationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lets the frontend (or an admin) trigger an expiry check + email on demand,
 * instead of waiting for the daily cron. Handy for the dashboard's
 * "Send expiry alerts now" action and for testing the SMTP setup.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final ExpiryNotificationService expiryNotificationService;

    public NotificationController(ExpiryNotificationService expiryNotificationService) {
        this.expiryNotificationService = expiryNotificationService;
    }

    @PostMapping("/check-expiry")
    public ExpiryNotificationService.ExpiryCheckResult triggerCheck() {
        return expiryNotificationService.checkExpiriesAndNotify();
    }
}
