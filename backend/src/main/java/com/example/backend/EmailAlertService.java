package com.example.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service that gathers low-stock and expiring medicine data,
 * formats it, and sends consolidated daily email alerts to
 * Admin and Pharmacist users.
 *
 * Also provides real-time critical alert emails for urgent
 * inventory situations (out of stock, critically low stock,
 * or medicines expiring within 7 days).
 */
@Service
public class EmailAlertService {

    private static final Logger log = LoggerFactory.getLogger(EmailAlertService.class);

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.email.alert-recipient-roles:Admin,Pharmacist}")
    private String alertRecipientRoles;

    // Thresholds (consistent with MedicineAlertScheduler)
    private static final int LOW_STOCK_THRESHOLD = 10;
    private static final int EXPIRE_WINDOW_DAYS = 30;
    private static final int CRITICAL_LOW_STOCK_THRESHOLD = 5;
    private static final int IMMEDIATE_EXPIRE_WINDOW_DAYS = 7;

    public EmailAlertService(MedicineRepository medicineRepository,
                             UserRepository userRepository,
                             EmailService emailService) {
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // ─── DAILY CONSOLIDATED SUMMARY ─────────────────────────────

    /**
     * Gathers all low-stock and expiring medicine data, then sends
     * a consolidated HTML email to each Admin and Pharmacist user.
     * <p>
     * Called by the scheduler after the daily in-app notification scan.
     */
    public void sendDailyAlertSummary() {
        try {
            // Gather data
            List<AlertMedicineItem> lowStockItems = getLowStockMedicines();
            List<AlertMedicineItem> expiringItems = getExpiringMedicines();

            // Collect target recipients (Admin + Pharmacist)
            List<User> recipients = getAlertRecipients();

            if (recipients.isEmpty()) {
                log.warn("No recipients found for email alerts (roles: {}). Skipping email send.",
                        alertRecipientRoles);
                return;
            }

            // Common template variables
            String reportDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
            int lowStockCount = lowStockItems.size();
            int expiringCount = expiringItems.size();

            // Send to each recipient
            for (User recipient : recipients) {
                Map<String, Object> variables = new HashMap<>();
                variables.put("reportDate", reportDate);
                variables.put("recipientName", recipient.getName());
                variables.put("recipientEmail", recipient.getEmail());
                variables.put("lowStockMedicines", lowStockItems);
                variables.put("expiringMedicines", expiringItems);
                variables.put("lowStockCount", lowStockCount);
                variables.put("expiringCount", expiringCount);

                String subject = String.format(
                        "MediStock Daily Alert Summary — %d low stock, %d expiring",
                        lowStockCount, expiringCount);

                emailService.sendHtmlEmail(
                        recipient.getEmail(),
                        subject,
                        "email-alert",
                        variables
                );
            }

            log.info("Daily alert summary emails sent to {} recipients ({} low stock, {} expiring).",
                    recipients.size(), lowStockCount, expiringCount);

        } catch (Exception e) {
            log.error("Error sending daily alert summary emails: {}", e.getMessage());
        }
    }

    // ─── IMMEDIATE / REAL-TIME CRITICAL ALERTS ─────────────────

    /**
     * Sends an immediate critical alert email for a medicine that is
     * out of stock or critically low (<= 5 units).
     * This is fired in real-time when a medicine is created/updated.
     */
    public void sendImmediateCriticalStockAlert(String medicineName, String batchNumber,
                                                  int quantity, Integer medicineId) {
        try {
            List<User> recipients = getAlertRecipients();
            if (recipients.isEmpty()) {
                log.warn("No recipients for critical stock alert email. Skipping.");
                return;
            }

            String alertType = (quantity <= 0) ? "Out of Stock" : "Critically Low Stock";
            String subject = String.format("🚨 %s: %s (%s)", alertType, medicineName, batchNumber);

            for (User recipient : recipients) {
                Map<String, Object> variables = new HashMap<>();
                variables.put("alertType", alertType);
                variables.put("medicineName", medicineName);
                variables.put("batchNumber", batchNumber);
                variables.put("quantity", quantity);
                variables.put("recipientName", recipient.getName());
                variables.put("recipientEmail", recipient.getEmail());
                variables.put("isOutOfStock", quantity <= 0);
                variables.put("isCritical", quantity > 0 && quantity <= CRITICAL_LOW_STOCK_THRESHOLD);
                variables.put("timestamp", LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));

                emailService.sendHtmlEmail(
                        recipient.getEmail(),
                        subject,
                        "email-critical-alert",
                        variables
                );
            }

            log.info("Immediate critical stock alert sent to {} recipients for {} (qty: {})",
                    recipients.size(), medicineName, quantity);

        } catch (Exception e) {
            log.error("Error sending immediate critical stock alert: {}", e.getMessage());
        }
    }

    /**
     * Sends an immediate alert for a medicine that is expiring within 7 days
     * or has already expired. Fired in real-time when medicine is created/updated.
     */
    public void sendImmediateExpiringAlert(String medicineName, String batchNumber,
                                             LocalDate expiryDate, int daysToExpiry,
                                             Integer medicineId) {
        try {
            List<User> recipients = getAlertRecipients();
            if (recipients.isEmpty()) {
                log.warn("No recipients for expiring alert email. Skipping.");
                return;
            }

            String alertType = (daysToExpiry <= 0) ? "Expired" : "Expiring Soon";
            String subject = String.format("⏰ %s: %s (%s) — %s", alertType, medicineName,
                    batchNumber, daysToExpiry <= 0 ? "EXPIRED" : daysToExpiry + " days left");

            for (User recipient : recipients) {
                Map<String, Object> variables = new HashMap<>();
                variables.put("alertType", alertType);
                variables.put("medicineName", medicineName);
                variables.put("batchNumber", batchNumber);
                variables.put("expiryDate", expiryDate);
                variables.put("daysToExpiry", daysToExpiry);
                variables.put("recipientName", recipient.getName());
                variables.put("recipientEmail", recipient.getEmail());
                variables.put("isExpired", daysToExpiry <= 0);
                variables.put("isCritical", daysToExpiry > 0 && daysToExpiry <= 7);
                variables.put("timestamp", LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));

                emailService.sendHtmlEmail(
                        recipient.getEmail(),
                        subject,
                        "email-critical-alert",
                        variables
                );
            }

            log.info("Immediate expiring alert sent to {} recipients for {} (expires: {})",
                    recipients.size(), medicineName, expiryDate);

        } catch (Exception e) {
            log.error("Error sending immediate expiring alert: {}", e.getMessage());
        }
    }

    // ─── TEST EMAIL ────────────────────────────────────────────

    /**
     * Sends a test email to verify SMTP configuration is working.
     *
     * @param recipientEmail The email address to send the test to
     * @param recipientName  The recipient's display name
     */
    public void sendTestEmail(String recipientEmail, String recipientName) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("recipientName", recipientName);
        variables.put("recipientEmail", recipientEmail);
        variables.put("timestamp", LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));

        emailService.sendHtmlEmail(
                recipientEmail,
                "MediStock — Test Email Configuration",
                "email-test",
                variables
        );

        log.info("Test email sent to {} <{}>", recipientName, recipientEmail);
    }

    // ─── HELPER METHODS ────────────────────────────────────────

    /**
     * Returns all users whose roles are in the configured alert recipient roles list.
     */
    private List<User> getAlertRecipients() {
        return userRepository.findAll().stream()
                .filter(u -> {
                    String role = u.getRole();
                    for (String allowed : alertRecipientRoles.split(",")) {
                        if (role.equalsIgnoreCase(allowed.trim())) {
                            return true;
                        }
                    }
                    return false;
                })
                .filter(u -> u.getEmail() != null && !u.getEmail().isBlank())
                .collect(Collectors.toList());
    }

    /**
     * Fetch all medicines with quantity <= LOW_STOCK_THRESHOLD.
     */
    private List<AlertMedicineItem> getLowStockMedicines() {
        return medicineRepository.findAll().stream()
                .filter(m -> m.getQuantity() != null && m.getQuantity() <= LOW_STOCK_THRESHOLD)
                .map(m -> new AlertMedicineItem(
                        m.getName(),
                        m.getBatchNumber() != null ? m.getBatchNumber() : "N/A",
                        m.getQuantity(),
                        null, // no expiry info for stock alerts
                        null
                ))
                .sorted(Comparator.comparingInt(AlertMedicineItem::getQuantity))
                .collect(Collectors.toList());
    }

    /**
     * Fetch all medicines expiring within EXPIRE_WINDOW_DAYS from now (or already expired).
     */
    private List<AlertMedicineItem> getExpiringMedicines() {
        LocalDate today = LocalDate.now();
        return medicineRepository.findAll().stream()
                .filter(m -> m.getExpiryDate() != null)
                .filter(m -> {
                    long days = ChronoUnit.DAYS.between(today, m.getExpiryDate());
                    return days <= EXPIRE_WINDOW_DAYS;
                })
                .map(m -> {
                    long daysToExpiry = ChronoUnit.DAYS.between(today, m.getExpiryDate());
                    return new AlertMedicineItem(
                            m.getName(),
                            m.getBatchNumber() != null ? m.getBatchNumber() : "N/A",
                            null, // no quantity info for expiry alerts
                            m.getExpiryDate(),
                            (int) daysToExpiry
                    );
                })
                .sorted(Comparator.comparingInt(AlertMedicineItem::getDaysToExpiry))
                .collect(Collectors.toList());
    }

    // ─── Inner DTO for template data ───────────────────────────

    /**
     * Simple inner class representing a medicine alert row for the email template.
     * Used instead of a full DTO to keep things self-contained.
     */
    public static class AlertMedicineItem {
        private String name;
        private String batchNumber;
        private Integer quantity;
        private LocalDate expiryDate;
        private Integer daysToExpiry;

        public AlertMedicineItem(String name, String batchNumber, Integer quantity,
                                 LocalDate expiryDate, Integer daysToExpiry) {
            this.name = name;
            this.batchNumber = batchNumber;
            this.quantity = quantity;
            this.expiryDate = expiryDate;
            this.daysToExpiry = daysToExpiry;
        }

        public String getName() { return name; }
        public String getBatchNumber() { return batchNumber; }
        public Integer getQuantity() { return quantity; }
        public LocalDate getExpiryDate() { return expiryDate; }
        public Integer getDaysToExpiry() { return daysToExpiry; }
    }
}
