package com.example.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller providing manual trigger endpoints for email alerts.
 *
 * - POST /api/email-alerts/send-summary → Manually trigger the daily summary email
 * - POST /api/email-alerts/test          → Send a test email to verify SMTP config
 *
 * These endpoints are secured and require authentication with Admin or Pharmacist role.
 */
@RestController
@RequestMapping("/api/email-alerts")
public class EmailAlertController {

    private static final Logger log = LoggerFactory.getLogger(EmailAlertController.class);

    private final EmailAlertService emailAlertService;
    private final UserRepository userRepository;

    public EmailAlertController(EmailAlertService emailAlertService,
                                 UserRepository userRepository) {
        this.emailAlertService = emailAlertService;
        this.userRepository = userRepository;
    }

    /**
     * Manually trigger the daily alert summary email to all Admin and Pharmacist users.
     * This is useful if an admin wants to send an immediate summary without waiting
     * for the next scheduled run.
     */
    @PostMapping("/send-summary")
    public ResponseEntity<Map<String, Object>> sendSummaryEmail(Authentication authentication) {
        String username = authentication.getName();
        log.info("Manual email summary trigger requested by user: {}", username);

        // Execute asynchronously - the EmailService handles email sending asynchronously
        emailAlertService.sendDailyAlertSummary();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Daily alert summary email has been triggered. Recipients will receive it shortly."
        ));
    }

    /**
     * Send a test email to the currently authenticated user's email address.
     * This allows admins/pharmacists to verify that SMTP configuration is working
     * before relying on the system for critical alerts.
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestEmail(Authentication authentication) {
        String username = authentication.getName();
        log.info("Test email requested by user: {}", username);

        // Look up the current user's email from the database
        User currentUser = userRepository.findByEmail(username).orElse(null);

        if (currentUser == null || currentUser.getEmail() == null || currentUser.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Your user account does not have a valid email address configured."
            ));
        }

        // Send the test email
        emailAlertService.sendTestEmail(currentUser.getEmail(), currentUser.getName());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test email sent to " + currentUser.getEmail() + ". Please check your inbox."
        ));
    }

    /**
     * Get the status of the email configuration (without exposing secrets).
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getEmailStatus() {
        // Return basic status info about the email system
        return ResponseEntity.ok(Map.of(
                "success", true,
                "service", "EmailAlertService",
                "status", "active",
                "templates", new String[]{"email-alert", "email-critical-alert", "email-test"}
        ));
    }
}
