package com.medistock.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.medistock.backend.service.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendEmail(String to,
                          String subject,
                          String body) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);

            helper.setText(body, true);

            mailSender.send(message);

        } catch (Exception e) {

            throw new RuntimeException("Failed to send email", e);

        }
    }
}