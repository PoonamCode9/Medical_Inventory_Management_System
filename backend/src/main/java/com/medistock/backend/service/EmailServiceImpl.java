package com.medistock.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@medistock.com}")
    private String fromEmail;

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (mailSender == null) {
            logger.warn("JavaMailSender is not configured. Email to {} with subject '{}' was not sent.", to, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email alert successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email notification to {}: {}", to, e.getMessage());
        }
    }

    @Override
    public void sendAlertEmail(String to, String alertType, String alertMessage) {
        String alertColor = alertType.equalsIgnoreCase("LOW_STOCK") ? "#f59e0b" : "#ef4444";
        String alertTitle = alertType.equalsIgnoreCase("LOW_STOCK") ? "Low Stock Alert" : "Medicine Expiry Alert";
        String alertIcon = alertType.equalsIgnoreCase("LOW_STOCK") ? "⚠️" : "⏰";

        String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; padding: 30px; color: #f1f5f9; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;\">" +
                "  <div style=\"text-align: center; margin-bottom: 25px;\">" +
                "    <span style=\"font-size: 40px;\">" + alertIcon + "</span>" +
                "    <h2 style=\"color: " + alertColor + "; margin-top: 10px; font-weight: 800; font-size: 24px; text-transform: uppercase; letter-spacing: 0.5px;\">" + alertTitle + "</h2>" +
                "  </div>" +
                "  <div style=\"background-color: #1e293b; padding: 25px; border-radius: 12px; border-left: 5px solid " + alertColor + "; margin-bottom: 25px;\">" +
                "    <p style=\"font-size: 15px; line-height: 1.6; margin: 0; color: #cbd5e1;\">" + alertMessage + "</p>" +
                "  </div>" +
                "  <div style=\"background-color: #1e293b/50; padding: 15px; border-radius: 10px; font-size: 12px; color: #64748b; text-align: center;\">" +
                "    This is an automated system alert from your <strong>MediStock Inventory Portal</strong>.<br/>" +
                "    Please log in to your dashboard to resolve this notification." +
                "  </div>" +
                "  <div style=\"text-align: center; margin-top: 25px;\">" +
                "    <a href=\"http://localhost:5173\" style=\"background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">Go to Dashboard</a>" +
                "  </div>" +
                "</div>";

        sendHtmlEmail(to, "[MediStock Alert] " + alertTitle, htmlContent);
    }
}
