package com.medistock.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medistock.backend.service.EmailService;

@RestController
@RequestMapping("/api/email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/test")
    public String sendTestMail() {

        emailService.sendEmail(
                "srivarshinivuchuru@gmail.com",
                "MediStock Email Test",
                """
                Hello,

                Congratulations!

                Your MediStock Email Service is working successfully.

                Regards,
                MediStock Team
                """
        );

        return "Email Sent Successfully!";
    }
}