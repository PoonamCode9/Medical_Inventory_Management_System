package com.medistock.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.service.EmailService;

@RestController
public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/api/test-email")
    public String testEmail(@RequestParam String to) {

        emailService.sendEmail(
                to,
                "MediStock Email Test",
                "This is a test email from the MediStock Medical Inventory Management System."
        );

        return "Test email sent successfully!";
    }
}