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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.Comparator;
import java.util.List;

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
            // Fetch metadata details
            String appName = "MediStock";
            String medicineName = "N/A";
            String genericName = "N/A";
            String batchNumber = "N/A";
            String categoryName = "N/A";
            String manufacturerName = "N/A";
            String manufactureDate = "N/A";
            String expiryDate = "N/A";
            String unitPrice = "N/A";

            String currentStock = "N/A";
            String previousStock = "N/A";
            String transactionType = "N/A";
            String transactionQty = "N/A";
            String stockStatus = "N/A";

            String supplierName = "N/A";
            String supplierContact = "N/A";
            String supplierPhone = "N/A";
            String supplierEmail = "N/A";

            String poIdStr = "N/A";
            String expectedDeliveryDate = "N/A"; // Not available in DB schema
            String poStatus = "N/A";
            String poTotalCost = "N/A";
            String poItemsHtml = "";

            String daysRemaining = "N/A";
            String actionRequired = "Please review this alert in the system console.";
            String notifTitle = notification.getTitle() != null ? notification.getTitle() : "MediStock Notification";

            String relatedModule = notification.getRelatedModule();
            Integer relatedId = notification.getRelatedEntityId();

            String updatedBy = "System";
            String msg = notification.getMessage() != null ? notification.getMessage() : "";
            if (msg.contains(" by ")) {
                int idx = msg.indexOf(" by ");
                updatedBy = msg.substring(idx + 4).trim();
                if (updatedBy.endsWith(".")) {
                    updatedBy = updatedBy.substring(0, updatedBy.length() - 1);
                }
            }

            if (relatedModule != null && relatedId != null) {
                try {
                    if ("INVENTORY".equalsIgnoreCase(relatedModule)) {
                        Optional<Inventory> invOpt = inventoryRepository.findById(relatedId);
                        if (invOpt.isPresent()) {
                            Inventory inv = invOpt.get();
                            currentStock = String.valueOf(inv.getQuantity());
                            Medicine med = inv.getMedicine();
                            if (med != null) {
                                medicineName = med.getMedicineName();
                                genericName = med.getGenericName() != null ? med.getGenericName() : "N/A";
                                batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                                if (med.getCategory() != null) {
                                    categoryName = med.getCategory().getCategoryName();
                                }
                                manufacturerName = med.getManufacturer() != null ? med.getManufacturer() : "N/A";
                                manufactureDate = med.getManufactureDate() != null ? med.getManufactureDate().toString() : "N/A";
                                expiryDate = med.getExpiryDate() != null ? med.getExpiryDate().toString() : "N/A";
                                unitPrice = med.getSellingPrice() != null ? "₹" + med.getSellingPrice() : (med.getUnitPrice() != null ? "₹" + med.getUnitPrice() : "N/A");
                                if (med.getSupplier() != null) {
                                    Supplier s = med.getSupplier();
                                    supplierName = s.getSupplierName();
                                    supplierContact = s.getContactPerson() != null ? s.getContactPerson() : "N/A";
                                    supplierPhone = s.getPhone() != null ? s.getPhone() : "N/A";
                                    supplierEmail = s.getEmail() != null ? s.getEmail() : "N/A";
                                }

                                // Query latest stock log for this medicine
                                List<StockLog> logs = stockLogRepository.findAll();
                                StockLog latestLog = logs.stream()
                                    .filter(l -> l.getMedicine() != null && l.getMedicine().getMedicineId().equals(med.getMedicineId()))
                                    .max(Comparator.comparing(StockLog::getUpdatedAt).thenComparing(StockLog::getStockLogId))
                                    .orElse(null);
                                if (latestLog != null) {
                                    transactionType = latestLog.getAction();
                                    transactionQty = String.valueOf(Math.abs(latestLog.getNewQuantity() - latestLog.getOldQuantity()));
                                    previousStock = String.valueOf(latestLog.getOldQuantity());
                                    currentStock = String.valueOf(latestLog.getNewQuantity());
                                    if (latestLog.getUser() != null) {
                                        updatedBy = latestLog.getUser().getEmail();
                                    }
                                }
                            }
                            stockStatus = inv.getQuantity() > 0 ? "In Stock" : "Out of Stock";
                        }
                    } else if ("EXPIRY".equalsIgnoreCase(relatedModule)) {
                        Optional<Medicine> medOpt = medicineRepository.findById(relatedId);
                        if (medOpt.isPresent()) {
                            Medicine med = medOpt.get();
                            medicineName = med.getMedicineName();
                            genericName = med.getGenericName() != null ? med.getGenericName() : "N/A";
                            batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                            if (med.getCategory() != null) {
                                categoryName = med.getCategory().getCategoryName();
                            }
                            manufacturerName = med.getManufacturer() != null ? med.getManufacturer() : "N/A";
                            manufactureDate = med.getManufactureDate() != null ? med.getManufactureDate().toString() : "N/A";
                            expiryDate = med.getExpiryDate() != null ? med.getExpiryDate().toString() : "N/A";
                            unitPrice = med.getSellingPrice() != null ? "₹" + med.getSellingPrice() : (med.getUnitPrice() != null ? "₹" + med.getUnitPrice() : "N/A");
                            if (med.getExpiryDate() != null) {
                                long days = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), med.getExpiryDate());
                                daysRemaining = days + " days";
                            }
                            if (med.getInventory() != null) {
                                currentStock = String.valueOf(med.getInventory().getQuantity());
                                stockStatus = med.getInventory().getQuantity() > 0 ? "In Stock" : "Out of Stock";
                            }
                            if (med.getSupplier() != null) {
                                Supplier s = med.getSupplier();
                                supplierName = s.getSupplierName();
                                supplierContact = s.getContactPerson() != null ? s.getContactPerson() : "N/A";
                                supplierPhone = s.getPhone() != null ? s.getPhone() : "N/A";
                                supplierEmail = s.getEmail() != null ? s.getEmail() : "N/A";
                            }
                        }
                    } else if ("PURCHASE".equalsIgnoreCase(relatedModule)) {
                        Optional<PurchaseOrder> poOpt = purchaseOrderRepository.findById(relatedId);
                        if (poOpt.isPresent()) {
                            PurchaseOrder po = poOpt.get();
                            poIdStr = String.valueOf(po.getPurchaseOrderId());
                            poStatus = po.getStatus();
                            poTotalCost = po.getTotalAmount() != null ? "₹" + po.getTotalAmount() : "N/A";
                            if (po.getSupplier() != null) {
                                Supplier s = po.getSupplier();
                                supplierName = s.getSupplierName();
                                supplierContact = s.getContactPerson() != null ? s.getContactPerson() : "N/A";
                                supplierPhone = s.getPhone() != null ? s.getPhone() : "N/A";
                                supplierEmail = s.getEmail() != null ? s.getEmail() : "N/A";
                            }

                            if (po.getItems() != null && !po.getItems().isEmpty()) {
                                StringBuilder sb = new StringBuilder();
                                sb.append("<table style='width:100%; border-collapse:collapse; margin-top:8px; font-size:12px;'>");
                                sb.append("<tr style='background-color:#F8FAFC; color:#475569;'><th style='border:1px solid #E2E8F0; padding:6px; text-align:left;'>Medicine</th><th style='border:1px solid #E2E8F0; padding:6px; text-align:center;'>Qty</th><th style='border:1px solid #E2E8F0; padding:6px; text-align:right;'>Unit Cost</th><th style='border:1px solid #E2E8F0; padding:6px; text-align:right;'>Total</th></tr>");
                                for (PurchaseOrderItem item : po.getItems()) {
                                    String medName = item.getMedicine() != null ? item.getMedicine().getMedicineName() : "Unknown";
                                    int qty = item.getQuantity() != null ? item.getQuantity() : 0;
                                    BigDecimal uPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                                    BigDecimal totalItem = uPrice.multiply(BigDecimal.valueOf(qty));
                                    sb.append("<tr>");
                                    sb.append("<td style='border:1px solid #E2E8F0; padding:6px; color:#0F172A;'>").append(medName).append("</td>");
                                    sb.append("<td style='border:1px solid #E2E8F0; padding:6px; text-align:center; color:#0F172A;'>").append(qty).append("</td>");
                                    sb.append("<td style='border:1px solid #E2E8F0; padding:6px; text-align:right; color:#0F172A;'>₹").append(uPrice).append("</td>");
                                    sb.append("<td style='border:1px solid #E2E8F0; padding:6px; text-align:right; color:#0F172A;'>₹").append(totalItem).append("</td>");
                                    sb.append("</tr>");
                                }
                                sb.append("</table>");
                                poItemsHtml = sb.toString();
                            }
                        }
                    } else if ("MEDICINE".equalsIgnoreCase(relatedModule)) {
                        Optional<Medicine> medOpt = medicineRepository.findById(relatedId);
                        if (medOpt.isPresent()) {
                            Medicine med = medOpt.get();
                            medicineName = med.getMedicineName();
                            genericName = med.getGenericName() != null ? med.getGenericName() : "N/A";
                            batchNumber = med.getBatchNumber() != null ? med.getBatchNumber() : "N/A";
                            if (med.getCategory() != null) {
                                categoryName = med.getCategory().getCategoryName();
                            }
                            manufacturerName = med.getManufacturer() != null ? med.getManufacturer() : "N/A";
                            manufactureDate = med.getManufactureDate() != null ? med.getManufactureDate().toString() : "N/A";
                            expiryDate = med.getExpiryDate() != null ? med.getExpiryDate().toString() : "N/A";
                            unitPrice = med.getSellingPrice() != null ? "₹" + med.getSellingPrice() : (med.getUnitPrice() != null ? "₹" + med.getUnitPrice() : "N/A");
                            if (med.getInventory() != null) {
                                currentStock = String.valueOf(med.getInventory().getQuantity());
                                stockStatus = med.getInventory().getQuantity() > 0 ? "In Stock" : "Out of Stock";
                            }
                            if (med.getSupplier() != null) {
                                Supplier s = med.getSupplier();
                                supplierName = s.getSupplierName();
                                supplierContact = s.getContactPerson() != null ? s.getContactPerson() : "N/A";
                                supplierPhone = s.getPhone() != null ? s.getPhone() : "N/A";
                                supplierEmail = s.getEmail() != null ? s.getEmail() : "N/A";
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

            // Construct Structured Sections
            String medicineDetailsSection = "";
            if (!"N/A".equals(medicineName)) {
                medicineDetailsSection = 
                    "<div style='margin-bottom: 24px;'>" +
                    "  <div style='border-left: 4px solid " + typeColor + "; padding-left: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 8px;'>Medicine Details</div>" +
                    "  <table class='details-table'>" +
                    "    <tr><th>Medicine Name</th><td>" + medicineName + "</td></tr>" +
                    "    <tr><th>Generic Name</th><td>" + genericName + "</td></tr>" +
                    "    <tr><th>Batch Number</th><td>" + batchNumber + "</td></tr>" +
                    "    <tr><th>Category</th><td>" + categoryName + "</td></tr>" +
                    "    <tr><th>Manufacturer</th><td>" + manufacturerName + "</td></tr>" +
                    "    <tr><th>Manufacturing Date</th><td>" + manufactureDate + "</td></tr>" +
                    "    <tr><th>Expiry Date</th><td>" + expiryDate + "</td></tr>" +
                    "    <tr><th>Unit Price</th><td>" + unitPrice + "</td></tr>" +
                    "  </table>" +
                    "</div>";
            }

            String inventoryDetailsSection = "";
            if ("INVENTORY".equalsIgnoreCase(relatedModule) || "EXPIRY".equalsIgnoreCase(relatedModule) || "MEDICINE".equalsIgnoreCase(relatedModule)) {
                StringBuilder sb = new StringBuilder();
                sb.append("<div style='margin-bottom: 24px;'>")
                  .append("  <div style='border-left: 4px solid ").append(typeColor).append("; padding-left: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 8px;'>Inventory Details</div>")
                  .append("  <table class='details-table'>");
                
                if ("INVENTORY".equalsIgnoreCase(relatedModule)) {
                    sb.append("    <tr><th>Transaction Type</th><td>").append(transactionType).append("</td></tr>")
                      .append("    <tr><th>Transaction Quantity</th><td>").append(transactionQty).append("</td></tr>")
                      .append("    <tr><th>Previous Stock</th><td>").append(previousStock).append("</td></tr>");
                }
                sb.append("    <tr><th>Current Stock Quantity</th><td>").append(currentStock).append("</td></tr>")
                  .append("    <tr><th>Stock Status</th><td>").append(stockStatus).append("</td></tr>");
                
                if ("EXPIRY".equalsIgnoreCase(relatedModule)) {
                    sb.append("    <tr><th>Days Remaining</th><td>").append(daysRemaining).append("</td></tr>");
                }
                
                sb.append("  </table>")
                  .append("</div>");
                inventoryDetailsSection = sb.toString();
            }

            String purchaseOrderSection = "";
            if ("PURCHASE".equalsIgnoreCase(relatedModule)) {
                purchaseOrderSection = 
                    "<div style='margin-bottom: 24px;'>" +
                    "  <div style='border-left: 4px solid " + typeColor + "; padding-left: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 8px;'>Purchase Order Details</div>" +
                    "  <table class='details-table'>" +
                    "    <tr><th>Purchase Order ID</th><td>" + poIdStr + "</td></tr>" +
                    "    <tr><th>Purchase Status</th><td>" + poStatus + "</td></tr>" +
                    "    <tr><th>Expected Delivery Date</th><td>" + expectedDeliveryDate + "</td></tr>" +
                    "    <tr><th>Total Cost</th><td>" + poTotalCost + "</td></tr>" +
                    "  </table>" +
                    "  <div style='margin-top:12px; font-weight:600; font-size:12px; color:#475569;'>Ordered Items:</div>" +
                    poItemsHtml +
                    "</div>";
            }

            String supplierDetailsSection = "";
            if (!"N/A".equals(supplierName)) {
                supplierDetailsSection = 
                    "<div style='margin-bottom: 24px;'>" +
                    "  <div style='border-left: 4px solid " + typeColor + "; padding-left: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 8px;'>Supplier Details</div>" +
                    "  <table class='details-table'>" +
                    "    <tr><th>Supplier Name</th><td>" + supplierName + "</td></tr>" +
                    "    <tr><th>Contact Person</th><td>" + supplierContact + "</td></tr>" +
                    "    <tr><th>Phone Number</th><td>" + supplierPhone + "</td></tr>" +
                    "    <tr><th>Email Address</th><td>" + supplierEmail + "</td></tr>" +
                    "  </table>" +
                    "</div>";
            }

            String notificationDetailsSection = 
                "<div style='margin-bottom: 24px;'>" +
                "  <div style='border-left: 4px solid " + typeColor + "; padding-left: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #475569; margin-bottom: 8px;'>Notification Details</div>" +
                "  <table class='details-table'>" +
                "    <tr><th>Notification Type</th><td>" + notifType + "</td></tr>" +
                "    <tr><th>Priority Level</th><td>" + notification.getPriority() + "</td></tr>" +
                "    <tr><th>Created / Updated By</th><td>" + updatedBy + "</td></tr>" +
                "    <tr><th>Date & Time</th><td>" + dateStr + " @ " + timeStr + "</td></tr>" +
                "  </table>" +
                "</div>";

            String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='utf-8'>" +
                "<title>" + notifTitle + "</title>" +
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
                ".details-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; }" +
                ".details-table th, .details-table td { padding: 10px 14px; border-bottom: 1px solid #F1F5F9; text-align: left; }" +
                ".details-table th { background-color: #F8FAFC; color: #475569; font-weight: 600; width: 40%; }" +
                ".details-table td { color: #0F172A; font-weight: 500; }" +
                ".action-box { background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 4px; font-size: 13px; color: #92400E; font-weight: 500; line-height: 1.5; margin-bottom: 24px; }" +
                ".footer { background-color: #F8FAFC; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "  <div class='header' style='background-color: " + typeColor + ";'>" +
                "    <h1>" + appName + " Pharmacy Portal</h1>" +
                "    <p>Automated Systems Monitoring Alert</p>" +
                "  </div>" +
                "  <div class='content'>" +
                "    <div class='alert-badge' style='background-color: " + typeColor + ";'>" + notifType.replace("_", " ") + "</div>" +
                "    <h2>" + notifTitle + "</h2>" +
                "    <p class='desc'>" + notification.getMessage() + "</p>" +
                
                medicineDetailsSection +
                inventoryDetailsSection +
                purchaseOrderSection +
                supplierDetailsSection +
                notificationDetailsSection +
                
                "    <div class='action-box'>" +
                "      <strong>Required Action:</strong><br>" + actionRequired +
                "    </div>" +
                "  </div>" +
                "  <div class='footer'>" +
                "    This is an automated notification generated by the MediStock Medical Inventory Management Platform. Please do not reply to this email." +
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
