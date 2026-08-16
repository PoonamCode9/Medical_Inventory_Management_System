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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private StockLogRepository stockLogRepository;

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
            // Data variables loaded strictly from backend entities
            String appName = "MediStock";
            String medicineName = null;
            String batchNumber = null;
            String categoryName = null;
            String supplierName = null;
            String expiryDateStr = null;
            String unitPriceStr = null;

            Integer currentStockVal = null;
            Integer minimumStockVal = null;
            String stockStatusText = null;
            String stockBadgeBg = "#10B981"; // Default Green
            String stockBadgeColor = "#FFFFFF";

            String notifType = notification.getType() != null ? notification.getType() : "INFO";
            String priority = notification.getPriority();
            String createdBy = "System";
            String dateStr = notification.getCreatedAt() != null ? DateTimeFormatter.ofPattern("yyyy-MM-dd").format(notification.getCreatedAt()) : DateTimeFormatter.ofPattern("yyyy-MM-dd").format(LocalDateTime.now());
            String timeStr = notification.getCreatedAt() != null ? DateTimeFormatter.ofPattern("HH:mm:ss").format(notification.getCreatedAt()) : DateTimeFormatter.ofPattern("HH:mm:ss").format(LocalDateTime.now());

            // Determine dynamic priority if missing or normalize
            if (priority == null || priority.trim().isEmpty()) {
                if ("LOW_STOCK".equalsIgnoreCase(notifType)) {
                    priority = "High";
                } else if ("EXPIRED".equalsIgnoreCase(notifType) || "EXPIRY_ALERT".equalsIgnoreCase(notifType)) {
                    priority = "Critical";
                } else if ("MEDICINE_CREATE".equalsIgnoreCase(notifType)) {
                    priority = "Low";
                } else if ("MEDICINE_UPDATE".equalsIgnoreCase(notifType) || "MEDICINE_DELETE".equalsIgnoreCase(notifType) || "PURCHASE".equalsIgnoreCase(notifType)) {
                    priority = "Medium";
                } else {
                    priority = "Medium";
                }
            }

            // Map priority/type to appropriate classification label
            String classification = "Information";
            String priorityUpper = priority.toUpperCase();
            String typeUpper = notifType.toUpperCase();
            if ("CRITICAL".equals(priorityUpper) || "EXPIRED".equals(typeUpper) || "CRITICAL".equals(typeUpper)) {
                classification = "Critical";
            } else if ("HIGH".equals(priorityUpper) || "MEDIUM".equals(priorityUpper) || "LOW_STOCK".equals(typeUpper) || "OUT_OF_STOCK".equals(typeUpper) || "WARNING".equals(typeUpper)) {
                classification = "Warning";
            } else if (typeUpper.contains("SUCCESS") || "SUCCESS".equals(priorityUpper)) {
                classification = "Success";
            }

            String notifTitle = notification.getTitle() != null 
                ? notification.getTitle().replace("Alert", classification).replace("Warning", classification).replace("Notification", classification)
                : ("MediStock " + classification + " Message");
            notifTitle = notifTitle.replace("Alert", classification).replace("Warning", classification).replace("Notification", classification).replace("N/A", "");

            // Extract creator from message if present
            String msg = notification.getMessage() != null ? notification.getMessage() : "";
            msg = msg.replace("Alert", classification).replace("Warning", classification).replace("Notification", classification).replace("N/A", "");
            if (msg.contains(" by ")) {
                int idx = msg.indexOf(" by ");
                String extracted = msg.substring(idx + 4).trim();
                if (extracted.endsWith(".")) {
                    extracted = extracted.substring(0, extracted.length() - 1);
                }
                if (!extracted.isEmpty()) {
                    createdBy = extracted;
                }
            }
            if (createdBy == null || "N/A".equalsIgnoreCase(createdBy.trim())) {
                createdBy = "System";
            }

            // Fetch related entity context dynamically from backend DB
            String relatedModule = notification.getRelatedModule();
            Integer relatedId = notification.getRelatedEntityId();

            Medicine medicineEntity = null;
            Inventory inventoryEntity = null;
            Supplier supplierEntity = null;

            if (relatedModule != null && relatedId != null) {
                if ("MEDICINE".equalsIgnoreCase(relatedModule) || "EXPIRY".equalsIgnoreCase(relatedModule)) {
                    Optional<Medicine> medOpt = medicineRepository.findById(relatedId);
                    if (medOpt.isPresent()) {
                        medicineEntity = medOpt.get();
                        inventoryEntity = medicineEntity.getInventory();
                        supplierEntity = medicineEntity.getSupplier();
                    }
                } else if ("INVENTORY".equalsIgnoreCase(relatedModule)) {
                    Optional<Inventory> invOpt = inventoryRepository.findById(relatedId);
                    if (invOpt.isPresent()) {
                        inventoryEntity = invOpt.get();
                        medicineEntity = inventoryEntity.getMedicine();
                        if (medicineEntity != null) {
                            supplierEntity = medicineEntity.getSupplier();
                        }
                    }
                } else if ("PURCHASE".equalsIgnoreCase(relatedModule)) {
                    Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(relatedId);
                    if (poOpt.isPresent()) {
                        PurchaseOrder po = poOpt.get();
                        supplierEntity = po.getSupplier();
                        if (po.getItems() != null && !po.getItems().isEmpty()) {
                            medicineEntity = po.getItems().get(0).getMedicine();
                            if (medicineEntity != null) {
                                inventoryEntity = medicineEntity.getInventory();
                            }
                        }
                    }
                }
            }

            // Fallback lookup if medicine was found but inventory entity unpopulated
            if (medicineEntity != null && inventoryEntity == null) {
                inventoryEntity = medicineEntity.getInventory();
            }

            // Bind values directly from backend entities
            if (medicineEntity != null) {
                medicineName = medicineEntity.getMedicineName();
                batchNumber = medicineEntity.getBatchNumber();
                if (medicineEntity.getCategory() != null) {
                    categoryName = medicineEntity.getCategory().getCategoryName();
                }
                if (supplierEntity == null && medicineEntity.getSupplier() != null) {
                    supplierEntity = medicineEntity.getSupplier();
                }
                if (medicineEntity.getExpiryDate() != null) {
                    expiryDateStr = medicineEntity.getExpiryDate().toString();
                }
                BigDecimal price = medicineEntity.getSellingPrice() != null ? medicineEntity.getSellingPrice() : medicineEntity.getUnitPrice();
                if (price != null) {
                    unitPriceStr = "₹" + String.format("%.2f", price);
                }
            }

            if (supplierEntity != null) {
                supplierName = supplierEntity.getSupplierName();
            }

            if (inventoryEntity != null) {
                currentStockVal = inventoryEntity.getQuantity();
                minimumStockVal = inventoryEntity.getMinimumStock();
            }

            // Compute Stock Status and badge color dynamically
            boolean isExpired = false;
            if (medicineEntity != null && medicineEntity.getExpiryDate() != null) {
                if (medicineEntity.getExpiryDate().isBefore(LocalDate.now())) {
                    isExpired = true;
                }
            }

            if (isExpired) {
                stockStatusText = "Expired";
                stockBadgeBg = "#991B1B"; // Dark Red
                stockBadgeColor = "#FFFFFF";
            } else if (currentStockVal != null && currentStockVal == 0) {
                stockStatusText = "Out of Stock";
                stockBadgeBg = "#DC2626"; // Red
                stockBadgeColor = "#FFFFFF";
            } else if (currentStockVal != null && minimumStockVal != null && currentStockVal <= minimumStockVal) {
                stockStatusText = "Low Stock";
                stockBadgeBg = "#F97316"; // Orange
                stockBadgeColor = "#FFFFFF";
            } else {
                stockStatusText = "Healthy Stock";
                stockBadgeBg = "#10B981"; // Green
                stockBadgeColor = "#FFFFFF";
            }

            // Priority badge styling dynamically
            String priorityBadgeBg = "#3B82F6"; // Default Blue Medium
            if ("Critical".equalsIgnoreCase(priority) || "DANGER".equalsIgnoreCase(priority)) {
                priorityBadgeBg = "#991B1B"; // Dark Red
            } else if ("High".equalsIgnoreCase(priority) || "HIGH".equalsIgnoreCase(priority)) {
                priorityBadgeBg = "#EF4444"; // Bright Red
            } else if ("Medium".equalsIgnoreCase(priority) || "MEDIUM".equalsIgnoreCase(priority) || "WARNING".equalsIgnoreCase(priority)) {
                priorityBadgeBg = "#F59E0B"; // Amber / Orange
            } else if ("Low".equalsIgnoreCase(priority) || "LOW".equalsIgnoreCase(priority) || "INFO".equalsIgnoreCase(priority)) {
                priorityBadgeBg = "#10B981"; // Green
            }

            // Build dynamic sections safely omitting N/A defaults
            String medicineSectionHtml = "";
            if (medicineName != null || batchNumber != null || categoryName != null || supplierName != null || expiryDateStr != null || unitPriceStr != null) {
                StringBuilder sb = new StringBuilder();
                sb.append("<div style='margin-bottom: 24px; background: #FFFFFF; border-radius: 10px; padding: 20px; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.03);'>")
                  .append("  <div style='font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #004D40; margin-bottom: 14px; border-bottom: 2px solid #E0F2F1; padding-bottom: 8px;'>Medicine Details</div>")
                  .append("  <table style='width: 100%; border-collapse: collapse;'>");

                if (medicineName != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500; width: 40%;'>Medicine Name</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(medicineName).append("</td></tr>");
                }
                if (batchNumber != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Batch Number</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(batchNumber).append("</td></tr>");
                }
                if (categoryName != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Category</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(categoryName).append("</td></tr>");
                }
                if (supplierName != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Supplier</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(supplierName).append("</td></tr>");
                }
                if (expiryDateStr != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Expiry Date</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(expiryDateStr).append("</td></tr>");
                }
                if (unitPriceStr != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Unit Price</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(unitPriceStr).append("</td></tr>");
                }

                sb.append("  </table>")
                  .append("</div>");
                medicineSectionHtml = sb.toString();
            }

            String inventorySectionHtml = "";
            if (currentStockVal != null || minimumStockVal != null) {
                StringBuilder sb = new StringBuilder();
                sb.append("<div style='margin-bottom: 24px; background: #FFFFFF; border-radius: 10px; padding: 20px; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.03);'>")
                  .append("  <div style='font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #004D40; margin-bottom: 14px; border-bottom: 2px solid #E0F2F1; padding-bottom: 8px;'>Inventory Details</div>")
                  .append("  <table style='width: 100%; border-collapse: collapse;'>");

                if (currentStockVal != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500; width: 40%;'>Current Stock</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(currentStockVal).append(" units</td></tr>");
                }
                if (minimumStockVal != null) {
                    sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Minimum Stock</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>").append(minimumStockVal).append(" units</td></tr>");
                }

                sb.append("<tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Stock Status</td><td style='padding: 8px 0; font-size: 13px;'><span style='display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: ").append(stockBadgeBg).append("; color: ").append(stockBadgeColor).append(";'>").append(stockStatusText).append("</span></td></tr>");

                sb.append("  </table>")
                  .append("</div>");
                inventorySectionHtml = sb.toString();
            }

            String notificationSectionHtml = 
                "<div style='margin-bottom: 24px; background: #FFFFFF; border-radius: 10px; padding: 20px; border: 1px solid #E2E8F0; box-shadow: 0 2px 4px rgba(0,0,0,0.03);'>" +
                "  <div style='font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #004D40; margin-bottom: 14px; border-bottom: 2px solid #E0F2F1; padding-bottom: 8px;'>Notification Details</div>" +
                "  <table style='width: 100%; border-collapse: collapse;'>" +
                "    <tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500; width: 40%;'>Notification Type</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>" + notifType.replace("_", " ") + "</td></tr>" +
                "    <tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Priority</td><td style='padding: 8px 0; font-size: 13px;'><span style='display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: " + priorityBadgeBg + "; color: #FFFFFF;'>" + priority + "</span></td></tr>" +
                "    <tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Created By</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>" + createdBy + "</td></tr>" +
                "    <tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Date</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>" + dateStr + "</td></tr>" +
                "    <tr><td style='padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 500;'>Time</td><td style='padding: 8px 0; font-size: 13px; color: #0F172A; font-weight: 600;'>" + timeStr + "</td></tr>" +
                "  </table>" +
                "</div>";            String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='utf-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>" + notifTitle + "</title>" +
                "<style>" +
                "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F0FDF4; margin: 0; padding: 24px 12px; color: #1E293B; }" +
                ".wrapper { max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #E2E8F0; }" +
                ".header-banner { background: linear-gradient(135deg, #004D40 0%, #00796B 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }" +
                ".header-banner h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }" +
                ".header-banner p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500; letter-spacing: 0.2px; }" +
                ".main-body { padding: 32px 24px; background-color: #F8FAFC; }" +
                ".message-card { background: #FFFFFF; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #00796B; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }" +
                ".message-card h2 { margin: 0 0 8px 0; font-size: 16px; color: #0F172A; font-weight: 700; }" +
                ".message-card p { margin: 0; font-size: 14px; color: #475569; line-height: 1.5; }" +
                ".footer-banner { background-color: #F1F5F9; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; line-height: 1.6; }" +
                ".footer-banner p { margin: 4px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='wrapper'>" +
                "  <div class='header-banner'>" +
                "    <h1>MediStock Pharmacy Portal</h1>" +
                "    <p>Inventory Management " + classification + "</p>" +
                "  </div>" +
                "  <div class='main-body'>" +
                "    <div class='message-card'>" +
                "      <h2>" + notifTitle + "</h2>" +
                "      <p>" + msg + "</p>" +
                "    </div>" +
                
                medicineSectionHtml +
                inventorySectionHtml +
                notificationSectionHtml +
                
                "  </div>" +
                "  <div class='footer-banner'>" +
                "    <p>This is an automated notification generated by MediStock.</p>" +
                "    <p>Please do not reply to this email.</p>" +
                "    <p style='font-weight: 600; color: #334155; margin-top: 8px;'>© 2026 MediStock Pharmacy Portal</p>" +
                "  </div>" +
                "</div>" +
                "</body>" +
                "</html>";
 
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(recipientEmail);
            helper.setSubject("MediStock " + classification + ": " + notifTitle);
            helper.setText(htmlContent, true);
 
            mailSender.send(message);
            log.info("EmailNotificationService: Successfully sent HTML notification email to {}", recipientEmail);
        } catch (Exception e) {
            log.error("EmailNotificationService: Failed to send HTML email via JavaMailSender. Error: {}", e.getMessage());
        }
    }
}
