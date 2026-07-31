package com.medistock.backend.service;

import com.medistock.backend.config.NotificationProperties;
import com.medistock.backend.model.Medicine;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Sends real emails over SMTP via Spring's JavaMailSender.
 * Credentials come from environment variables (see application.yml) -
 * nothing sensitive is hard-coded here.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    private final JavaMailSender mailSender;
    private final NotificationProperties props;

    public EmailService(JavaMailSender mailSender, NotificationProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    /**
     * Sends one summary email listing all expired / critical / near-expiry medicines.
     * Returns true if the send succeeded.
     */
    public boolean sendExpirySummary(List<Medicine> expired, List<Medicine> critical, List<Medicine> nearExpiry) {
        String subject = buildSubject(expired, critical, nearExpiry);
        String html = buildHtmlBody(expired, critical, nearExpiry);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(props.getFromEmail());
            helper.setTo(props.getRecipientEmails().toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Expiry alert email sent to {} ({} expired, {} critical, {} near expiry)",
                    props.getRecipientEmails(), expired.size(), critical.size(), nearExpiry.size());
            return true;
        } catch (MessagingException | MailException e) {
            log.error("Failed to send expiry alert email: {}", e.getMessage(), e);
            return false;
        }
    }

    private String buildSubject(List<Medicine> expired, List<Medicine> critical, List<Medicine> nearExpiry) {
        int total = expired.size() + critical.size() + nearExpiry.size();
        if (!expired.isEmpty()) {
            return "[MediStock] URGENT: " + expired.size() + " medicine(s) expired";
        }
        return "[MediStock] Expiry alert: " + total + " medicine(s) need attention";
    }

    private String buildHtmlBody(List<Medicine> expired, List<Medicine> critical, List<Medicine> nearExpiry) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family:Arial,sans-serif;max-width:640px;margin:auto'>");
        sb.append("<h2 style='color:#0f766e'>MediStock — Expiry Alert</h2>");
        sb.append("<p>This is an automated summary of medicines that need attention in your inventory.</p>");

        appendSection(sb, "Expired", "#dc2626", expired);
        appendSection(sb, "Critical (\u226430 days left)", "#dc2626", critical);
        appendSection(sb, "Near expiry (31\u201390 days left)", "#d97706", nearExpiry);

        sb.append("<p style='color:#666;font-size:12px;margin-top:24px'>")
          .append("Sent automatically by MediStock. Log in to the dashboard's Expiry Tracker for full details.")
          .append("</p>");
        sb.append("</div>");
        return sb.toString();
    }

    private void appendSection(StringBuilder sb, String title, String color, List<Medicine> items) {
        if (items.isEmpty()) return;
        sb.append("<h3 style='color:").append(color).append(";margin-bottom:6px'>")
          .append(title).append(" (").append(items.size()).append(")</h3>");
        sb.append("<table style='width:100%;border-collapse:collapse;margin-bottom:16px'>");
        sb.append("<tr style='background:#f3f4f6;text-align:left'>")
          .append("<th style='padding:6px;border:1px solid #e5e7eb'>Medicine</th>")
          .append("<th style='padding:6px;border:1px solid #e5e7eb'>Batch</th>")
          .append("<th style='padding:6px;border:1px solid #e5e7eb'>Expiry date</th>")
          .append("<th style='padding:6px;border:1px solid #e5e7eb'>Qty</th></tr>");
        for (Medicine m : items) {
            sb.append("<tr>")
              .append("<td style='padding:6px;border:1px solid #e5e7eb'>").append(m.getName()).append("</td>")
              .append("<td style='padding:6px;border:1px solid #e5e7eb'>").append(m.getBatchNumber()).append("</td>")
              .append("<td style='padding:6px;border:1px solid #e5e7eb'>").append(m.getExpiryDate().format(DATE_FMT)).append("</td>")
              .append("<td style='padding:6px;border:1px solid #e5e7eb'>").append(m.getQuantity()).append("</td>")
              .append("</tr>");
        }
        sb.append("</table>");
    }
}
