package com.medicalinventory.controller;

import com.medicalinventory.service.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/api/email/test")
    public String sendTestEmail() {

        emailService.sendEmail(
                "rubenashaik124@gmail.com",
                "Medical Inventory - Test Email",
                "Congratulations! Your email configuration is working successfully.");

        return "Test email sent successfully!";
    }
}