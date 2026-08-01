package com.medical.om.om_backend.service;

import com.medical.om.om_backend.entity.Inventory;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends the HTML medicine-expiry report to the given recipients.
     * critical = expired or expiring within 10 days
     * warning  = expiring within 10–30 days
     */
    public void sendExpiryReport(List<String> recipients, List<Inventory> critical, List<Inventory> warning) {
        if (recipients == null || recipients.isEmpty()) return;

        String html = buildHtmlReport(critical, warning);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipients.toArray(new String[0]));
            helper.setSubject("⚠️ OM Medical — Medicine Expiry Report");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send expiry report email: " + e.getMessage(), e);
        }
    }

    private String buildHtmlReport(List<Inventory> critical, List<Inventory> warning) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
            <html><body style="font-family:system-ui,Arial,sans-serif;background:#f8fafc;padding:24px;">
            <h2 style="color:#0f172a;margin-bottom:4px;">⚠️ OM Medical — Medicine Expiry Report</h2>
            <p style="color:#64748b;margin-top:0;">Generated %s</p>
            """.formatted(LocalDate.now()));

        appendTable(sb, "🔴 CRITICAL — Already expired or expiring within 10 days", critical, "#fee2e2");
        appendTable(sb, "🟡 WARNING — Expiring within 10–30 days", warning, "#fef9c3");

        if (critical.isEmpty() && warning.isEmpty()) {
            sb.append("<p style=\"color:#15803d;font-weight:bold;\">✅ No medicines are expiring soon. All good!</p>");
        }

        sb.append("<p style=\"color:#94a3b8;font-size:12px;margin-top:24px;\">Automated report from OM Medical Inventory Management System.</p>");
        sb.append("</body></html>");
        return sb.toString();
    }

    private void appendTable(StringBuilder sb, String title, List<Inventory> items, String rowColor) {
        if (items == null || items.isEmpty()) return;
        sb.append("<h3 style=\"color:#0f172a;\">").append(title).append(" (").append(items.size()).append(")</h3>");
        sb.append("<table style=\"width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;margin-bottom:24px;\">");
        sb.append("<tr style=\"background:#0f172a;color:#ffffff;text-align:left;\">")
          .append("<th style=\"padding:10px;\">Medicine</th>")
          .append("<th style=\"padding:10px;\">Batch</th>")
          .append("<th style=\"padding:10px;\">Qty</th>")
          .append("<th style=\"padding:10px;\">Supplier</th>")
          .append("<th style=\"padding:10px;\">Expiry Date</th>")
          .append("<th style=\"padding:10px;\">Days Left</th>")
          .append("</tr>");
        for (Inventory i : items) {
            LocalDate exp = i.getExpiration_date();
            long daysLeft = exp != null ? ChronoUnit.DAYS.between(LocalDate.now(), exp) : 0;
            sb.append("<tr style=\"background:")
              .append(rowColor)
              .append(";\"><td style=\"padding:10px;\"><b>")
              .append(i.getMedicine() != null ? i.getMedicine().getName() : i.getMedicine_name())
              .append("</b></td><td style=\"padding:10px;\">")
              .append(i.getBatch() == null ? "—" : i.getBatch())
              .append("</td><td style=\"padding:10px;\">")
              .append(i.getAvailable_qty())
              .append("</td><td style=\"padding:10px;\">")
              .append(i.getSupplier() == null ? "—" : i.getSupplier())
              .append("</td><td style=\"padding:10px;\">")
              .append(exp == null ? "—" : exp)
              .append("</td><td style=\"padding:10px;\"><b>")
              .append(daysLeft < 0 ? "EXPIRED" : daysLeft + " days")
              .append("</b></td></tr>");
        }
        sb.append("</table>");
    }
}
