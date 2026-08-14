package com.medicalinventory.service.impl;

import com.medicalinventory.entity.Medicine;
import com.medicalinventory.service.EmailService;

import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Override
    public void sendLowStockAlertEmail(Medicine medicine) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("rubenashaik124@gmail.com");
            helper.setSubject("🚨 Low Stock Alert - Medical Inventory System");

            String htmlContent = String.format("""
                    <html>
                    <body style="font-family: Arial, sans-serif; background-color:#f7f9fc; padding:20px;">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        padding:30px;
                        border-radius:12px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.1);
                    ">

                    <div style="
                        background:#e3f2fd;
                        padding:20px;
                        text-align:center;
                        border-radius:10px;
                    ">

                    <h2 style="color:#1565c0;">
                    🏥 Medical Inventory System
                    </h2>

                    <h3 style="color:#ef6c00;">
                    ⚠ Low Stock Alert
                    </h3>

                    </div>


                    <p>Hello Admin,</p>

                    <p>
                    The following medicine has reached the low stock level.
                    Please take necessary action.
                    </p>


                    <table style="
                        width:80%%;
                        margin:25px auto;
                        border-collapse:collapse;
                        text-align:center;
                    ">

                    <tr style="background:#e3f2fd;">

                    <th style="padding:12px;border:1px solid #ddd;">
                    Medicine Name
                    </th>

                    <th style="padding:12px;border:1px solid #ddd;">
                    Quantity
                    </th>

                    <th style="padding:12px;border:1px solid #ddd;">
                    Status
                    </th>

                    </tr>


                    <tr>

                    <td style="padding:12px;border:1px solid #ddd;">
                    %s
                    </td>

                    <td style="padding:12px;border:1px solid #ddd;">
                    %d units
                    </td>

                    <td style="
                    padding:12px;
                    border:1px solid #ddd;
                    background:#fff3cd;
                    color:#856404;
                    font-weight:bold;
                    ">
                    LOW STOCK
                    </td>

                    </tr>

                    </table>


                    <div style="
                    background:#fff8e1;
                    padding:15px;
                    border-radius:8px;
                    margin-top:20px;
                    ">

                    <b>Recommended Action:</b>

                    <br>

                    Please restock this medicine soon to avoid shortage.

                    </div>


                    <hr style="margin-top:30px;">

                    <p style="
                    text-align:center;
                    color:#777;
                    font-size:12px;
                    ">

                    Automated alert from<br>
                    Medical Inventory Management System

                    </p>


                    </div>

                    </body>
                    </html>
                    """,
                    medicine.getMedicineName(),
                    medicine.getQuantity());

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }

    @Override
    public void sendExpiredMedicineEmail(Medicine medicine) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("rubenashaik124@gmail.com");

            helper.setSubject("🔴 Medicine Expired - Medical Inventory System");

            String htmlContent = String.format("""
                    <html>
                    <body style="font-family: Arial, sans-serif; background-color:#f7f9fc; padding:20px;">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        padding:30px;
                        border-radius:12px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.1);
                    ">

                    <div style="
                        background:#ffebee;
                        padding:20px;
                        text-align:center;
                        border-radius:10px;
                    ">

                    <h2 style="color:#c62828;">
                    🏥 Medical Inventory System
                    </h2>

                    <h3 style="color:#d32f2f;">
                    🔴 Medicine Expired
                    </h3>

                    </div>

                    <p>Hello Admin,</p>

                    <p>
                    The following medicine has expired and should not be dispensed.
                    </p>

                    <table style="
                        width:80%%;
                        margin:25px auto;
                        border-collapse:collapse;
                        text-align:center;
                    ">

                    <tr style="background:#ffebee;">

                    <th style="padding:12px;border:1px solid #ddd;">Medicine Name</th>
                    <th style="padding:12px;border:1px solid #ddd;">Expiry Date</th>
                    <th style="padding:12px;border:1px solid #ddd;">Status</th>

                    </tr>

                    <tr>

                    <td style="padding:12px;border:1px solid #ddd;">%s</td>

                    <td style="padding:12px;border:1px solid #ddd;">%s</td>

                    <td style="
                        padding:12px;
                        border:1px solid #ddd;
                        background:#ffcdd2;
                        color:#b71c1c;
                        font-weight:bold;
                    ">
                    EXPIRED
                    </td>

                    </tr>

                    </table>

                    <div style="
                        background:#ffebee;
                        padding:15px;
                        border-radius:8px;
                        margin-top:20px;
                    ">

                    <b>Recommended Action:</b><br>

                    Remove this medicine from inventory immediately.

                    </div>

                    <hr style="margin-top:30px;">

                    <p style="
                        text-align:center;
                        color:#777;
                        font-size:12px;
                    ">
                    Automated alert from<br>
                    Medical Inventory Management System
                    </p>

                    </div>

                    </body>
                    </html>
                    """,
                    medicine.getMedicineName(),
                    medicine.getExpiryDate());

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }

    @Override
    public void sendExpiringSoonEmail(Medicine medicine) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("rubenashaik124@gmail.com");

            helper.setSubject("🟡 Medicine Expiring Soon - Medical Inventory System");

            String htmlContent = String.format("""
                    <html>
                    <body style="font-family: Arial, sans-serif; background-color:#f7f9fc; padding:20px;">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        padding:30px;
                        border-radius:12px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.1);
                    ">

                    <div style="
                        background:#fff8e1;
                        padding:20px;
                        text-align:center;
                        border-radius:10px;
                    ">

                    <h2 style="color:#1565c0;">
                    🏥 Medical Inventory System
                    </h2>

                    <h3 style="color:#f9a825;">
                    🟡 Medicine Expiring Soon
                    </h3>

                    </div>

                    <p>Hello Admin,</p>

                    <p>
                    The following medicine will expire within the next <b>30 days</b>.
                    Please take the necessary action.
                    </p>

                    <table style="
                        width:80%%;
                        margin:25px auto;
                        border-collapse:collapse;
                        text-align:center;
                    ">

                    <tr style="background:#fff8e1;">

                    <th style="padding:12px;border:1px solid #ddd;">
                    Medicine Name
                    </th>

                    <th style="padding:12px;border:1px solid #ddd;">
                    Expiry Date
                    </th>

                    <th style="padding:12px;border:1px solid #ddd;">
                    Status
                    </th>

                    </tr>

                    <tr>

                    <td style="padding:12px;border:1px solid #ddd;">
                    %s
                    </td>

                    <td style="padding:12px;border:1px solid #ddd;">
                    %s
                    </td>

                    <td style="
                        padding:12px;
                        border:1px solid #ddd;
                        background:#fff3cd;
                        color:#856404;
                        font-weight:bold;
                    ">
                    EXPIRING SOON
                    </td>

                    </tr>

                    </table>

                    <div style="
                        background:#fff8e1;
                        padding:15px;
                        border-radius:8px;
                        margin-top:20px;
                    ">

                    <b>Recommended Action:</b>

                    <br><br>

                    Please review this medicine and plan to use, replace, or restock it before its expiry date.

                    </div>

                    <hr style="margin-top:30px;">

                    <p style="
                        text-align:center;
                        color:#777;
                        font-size:12px;
                    ">

                    Automated alert from<br>
                    Medical Inventory Management System

                    </p>

                    </div>

                    </body>
                    </html>
                    """,
                    medicine.getMedicineName(),
                    medicine.getExpiryDate());

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Email sending failed", e);
        }
    }
}