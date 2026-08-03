package com.medistock.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    // Send simple email
    public void sendEmail(
            String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.out.println("Email error: " + e.getMessage());
        }
    }

    // Send low stock alert
    public void sendLowStockAlert(
            String medicineName, int quantity) {
        String subject = "⚠️ Low Stock Alert — " + medicineName;
        String body = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #e94560;">💊 MediStock Alert</h2>
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: #f6ad55;">⚠️ Low Stock Warning!</h3>
                    <p>Medicine <strong>%s</strong> is running low!</p>
                    <p>Current Quantity: <strong style="color: #e53e3e;">%d units</strong></p>
                    <p>Please restock immediately!</p>
                    <br>
                    <p style="color: #718096;">— MediStock System</p>
                </div>
            </body>
            </html>
            """.formatted(medicineName, quantity);
        sendEmail(adminEmail, subject, body);
    }

    // Send expiry alert
    public void sendExpiryAlert(
            String medicineName,
            String expiryDate,
            long daysLeft) {
        String subject = "⏰ Expiry Alert — " + medicineName;
        String body = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #e94560;">💊 MediStock Alert</h2>
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: #e94560;">⏰ Expiry Warning!</h3>
                    <p>Medicine <strong>%s</strong> is expiring soon!</p>
                    <p>Expiry Date: <strong>%s</strong></p>
                    <p>Days Remaining: <strong style="color: #e53e3e;">%d days</strong></p>
                    <p>Please take action immediately!</p>
                    <br>
                    <p style="color: #718096;">— MediStock System</p>
                </div>
            </body>
            </html>
            """.formatted(medicineName, expiryDate, daysLeft);
        sendEmail(adminEmail, subject, body);
    }

    // Send purchase order alert
    public void sendPurchaseOrderAlert(
            String supplierName,
            String medicineName,
            int quantity,
            String status) {
        String subject = "🛒 Purchase Order " +
            status + " — " + medicineName;
        String body = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #e94560;">💊 MediStock Alert</h2>
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: #63b3ed;">🛒 Purchase Order Update!</h3>
                    <p>Supplier: <strong>%s</strong></p>
                    <p>Medicine: <strong>%s</strong></p>
                    <p>Quantity: <strong>%d units</strong></p>
                    <p>Status: <strong style="color: #68d391;">%s</strong></p>
                    <br>
                    <p style="color: #718096;">— MediStock System</p>
                </div>
            </body>
            </html>
            """.formatted(
                supplierName, medicineName,
                quantity, status
            );
        sendEmail(adminEmail, subject, body);
    }
}