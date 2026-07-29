package com.medistock.backend.service.impl;

import com.medistock.backend.entity.*;
import com.medistock.backend.repository.*;
import com.medistock.backend.service.EmailNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class EmailNotificationServiceImpl implements EmailNotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Override
    public void sendEmailNotification(String recipientEmail, Notification notification) {
        if (mailSender == null) {
            log.warn("EmailNotificationService: JavaMailSender configuration is unavailable. Email notification dispatch skipped.");
            return;
        }

        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            log.warn("EmailNotificationService: No recipient email provided. Skipping email delivery.");
            return;
        }

        try {
            // Fetch metadata details
            String appName = "MediStock";
            String medicineName = "N/A";
            String batchNumber = "N/A";
            String supplierName = "N/A";
            String currentStock = "N/A";
            String expiryDate = "N/A";
            String quantity = "N/A";
            String actionRequired = "Please review this alert in the system console.";

            String relatedModule = notification.getRelatedModule();
            Integer relatedId = notification.getRelatedEntityId();

            if (relatedModule != null && relatedId != null) {
                try {
                    if ("INVENTORY".equalsIgnoreCase(relatedModule)) {
                        java.util.Optional<Inventory> invOpt = inventoryRepository.findById(relatedId);
                        if (invOpt.isPresent()) {
                            Inventory inv = invOpt.get();
                            Medicine med = inv.getMedicine();
                            if (med != null) {
                                medicineName = med.getMedicineName();
                                batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                                if (med.getSupplier() != null) {
                                    supplierName = med.getSupplier().getSupplierName();
                                }
                                if (med.getExpiryDate() != null) {
                                    expiryDate = med.getExpiryDate().toString();
                                }
                            }
                            currentStock = String.valueOf(inv.getQuantity());
                        }
                    } else if ("EXPIRY".equalsIgnoreCase(relatedModule)) {
                        java.util.Optional<Medicine> medOpt = medicineRepository.findById(relatedId);
                        if (medOpt.isPresent()) {
                            Medicine med = medOpt.get();
                            medicineName = med.getMedicineName();
                            batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                            if (med.getSupplier() != null) {
                                supplierName = med.getSupplier().getSupplierName();
                            }
                            if (med.getExpiryDate() != null) {
                                expiryDate = med.getExpiryDate().toString();
                            }
                            if (med.getInventory() != null) {
                                currentStock = String.valueOf(med.getInventory().getQuantity());
                            }
                        }
                    } else if ("PURCHASE".equalsIgnoreCase(relatedModule)) {
                        java.util.Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(relatedId);
                        if (poOpt.isPresent()) {
                            PurchaseOrder po = poOpt.get();
                            if (po.getSupplier() != null) {
                                supplierName = po.getSupplier().getSupplierName();
                            }
                            quantity = String.valueOf(po.getItems() != null ? po.getItems().size() : 0) + " items";
                            currentStock = "N/A";
                        }
                    } else if ("MEDICINE".equalsIgnoreCase(relatedModule)) {
                        java.util.Optional<Medicine> medOpt = medicineRepository.findById(relatedId);
                        if (medOpt.isPresent()) {
                            Medicine med = medOpt.get();
                            medicineName = med.getMedicineName();
                            batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                            if (med.getSupplier() != null) {
                                supplierName = med.getSupplier().getSupplierName();
                            }
                            if (med.getExpiryDate() != null) {
                                expiryDate = med.getExpiryDate().toString();
                            }
                        }
                    }
                } catch (Exception ex) {
                    log.warn("EmailNotificationService: Error loading entity details for email rendering. Fallbacks will be used.", ex);
                }
            }

            // Customize Action Required message based on alert type
            String notifType = notification.getType() != null ? notification.getType() : "INFO";
            if ("LOW_STOCK".equals(notifType)) {
                actionRequired = "Urgent: Stock level is low. Please place a purchase order soon to replenish stock.";
            } else if ("OUT_OF_STOCK".equals(notifType)) {
                actionRequired = "Critical: Medicine is out of stock! Immediate procurement is required to restore supply.";
            } else if ("EXPIRY_ALERT".equals(notifType)) {
                actionRequired = "Warning: Medicine batch is expiring soon. Please ensure stock rotation or plan disposal.";
            } else if ("EXPIRED".equals(notifType)) {
                actionRequired = "Critical: Medicine batch has expired! Remove immediately from active stock and schedule disposal.";
            } else if ("PURCHASE_DELIVERED".equals(notifType) || "PURCHASE_RECEIVED".equals(notifType)) {
                actionRequired = "Info: Purchase order shipment received. Inventory has been replenished automatically.";
            }

            String dateStr = DateTimeFormatter.ofPattern("yyyy-MM-dd").format(notification.getCreatedAt());
            String timeStr = DateTimeFormatter.ofPattern("HH:mm:ss").format(notification.getCreatedAt());

            String typeColor = "#0F766E"; // Teal
            if ("DANGER".equalsIgnoreCase(notification.getPriority()) || "HIGH".equalsIgnoreCase(notification.getPriority())) {
                typeColor = "#B91C1C"; // Crimson red
            } else if ("WARNING".equalsIgnoreCase(notification.getPriority()) || "MEDIUM".equalsIgnoreCase(notification.getPriority())) {
                typeColor = "#D97706"; // Amber
            }

            String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='utf-8'>" +
                "<title>" + notification.getTitle() + "</title>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #1E293B; }" +
                ".container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0; }" +
                ".header { background-color: #0F766E; padding: 24px; text-align: center; color: #FFFFFF; }" +
                ".header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }" +
                ".header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; font-weight: 500; }" +
                ".content { padding: 32px; }" +
                ".alert-badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #FFFFFF; margin-bottom: 20px; }" +
                "h2 { margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #0F172A; }" +
                ".desc { font-size: 14px; line-height: 1.5; color: #475569; margin: 0 0 24px 0; }" +
                ".details-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; }" +
                ".details-table th, .details-table td { padding: 12px 16px; border-bottom: 1px solid #F1F5F9; text-align: left; }" +
                ".details-table th { background-color: #F8FAFC; color: #475569; font-weight: 600; width: 40%; }" +
                ".details-table td { color: #0F172A; font-weight: 500; }" +
                ".action-box { background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 4px; font-size: 13px; color: #92400E; font-weight: 500; line-height: 1.5; margin-bottom: 24px; }" +
                ".footer { background-color: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }" +
                ".footer a { color: #0F766E; text-decoration: none; font-weight: 600; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "  <div class='header'>" +
                "    <h1>" + appName + " Pharmacy Portal</h1>" +
                "    <p>Automated Systems Monitoring Alert</p>" +
                "  </div>" +
                "  <div class='content'>" +
                "    <div class='alert-badge' style='background-color: " + typeColor + ";'>" + notifType.replace("_", " ") + "</div>" +
                "    <h2>" + notification.getTitle() + "</h2>" +
                "    <p class='desc'>" + notification.getMessage() + "</p>" +
                "    <table class='details-table'>" +
                "      <tr><th>Recipient User</th><td>System Administrator / Pharmacist</td></tr>" +
                "      <tr><th>Medicine Product</th><td>" + medicineName + "</td></tr>" +
                "      <tr><th>Batch Number</th><td>" + batchNumber + "</td></tr>" +
                "      <tr><th>Supplier Info</th><td>" + supplierName + "</td></tr>" +
                "      <tr><th>Transaction Quantity</th><td>" + quantity + "</td></tr>" +
                "      <tr><th>Current Stock Count</th><td>" + currentStock + "</td></tr>" +
                "      <tr><th>Expiration Date</th><td>" + expiryDate + "</td></tr>" +
                "      <tr><th>Log Date</th><td>" + dateStr + "</td></tr>" +
                "      <tr><th>Log Time</th><td>" + timeStr + "</td></tr>" +
                "    </table>" +
                "    <div class='action-box'>" +
                "      <strong>Required Action:</strong><br>" + actionRequired +
                "    </div>" +
                "  </div>" +
                "  <div class='footer'>" +
                "    This is an automated operational alert generated by <a href='#'>" + appName + " Management Console</a>.<br>" +
                "    Please do not reply directly to this mail." +
                "  </div>" +
                "</div>" +
                "</body>" +
                "</html>";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(recipientEmail);
            helper.setSubject("MediStock Alert: " + notification.getTitle());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("EmailNotificationService: Successfully sent HTML notification to {}", recipientEmail);
        } catch (Exception e) {
            log.error("EmailNotificationService: Failed to send HTML email via JavaMailSender. Error: {}", e.getMessage());
        }
    }
}
