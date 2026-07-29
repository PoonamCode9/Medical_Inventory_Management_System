package com.medistock.backend.service.impl;

import com.medistock.backend.entity.*;
import com.medistock.backend.repository.*;
import com.medistock.backend.service.ExpiryService;
import com.medistock.backend.service.ReportService;
import com.medistock.backend.dto.response.ExpiryAlertResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ExpiryService expiryService;
    private final MedicineRepository medicineRepository;
    private final StockLogRepository stockLogRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public String generateCsvReport(String type) {
        StringBuilder csv = new StringBuilder();

        if ("inventory".equalsIgnoreCase(type) || "current-stock".equalsIgnoreCase(type)) {
            csv.append("Inventory ID,Medicine Name,Category,Quantity,Minimum Stock,Unit Price,Inventory Value\n");
            List<Inventory> list = inventoryRepository.findAll();
            for (Inventory item : list) {
                Medicine m = item.getMedicine();
                String name = m != null ? m.getMedicineName() : "Unknown";
                String cat = (m != null && m.getCategory() != null) ? m.getCategory().getCategoryName() : "General";
                BigDecimal price = m != null && m.getSellingPrice() != null ? m.getSellingPrice() : BigDecimal.ZERO;
                BigDecimal totalVal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
                
                csv.append(item.getInventoryId()).append(",")
                   .append("\"").append(name.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(cat.replace("\"", "\"\"")).append("\",")
                   .append(item.getQuantity()).append(",")
                   .append(item.getMinimumStock()).append(",")
                   .append(price).append(",")
                   .append(totalVal).append("\n");
            }
        } 
        else if ("medicine".equalsIgnoreCase(type)) {
            csv.append("Medicine ID,Medicine Name,Generic Name,Category,Supplier,Dosage,Unit,Manufacturer,Manufacture Date,Expiry Date,Purchase Price,Selling Price,Barcode\n");
            List<Medicine> meds = medicineRepository.findAll();
            for (Medicine m : meds) {
                String cat = m.getCategory() != null ? m.getCategory().getCategoryName() : "General";
                String supp = m.getSupplier() != null ? m.getSupplier().getSupplierName() : "Unknown";
                csv.append(m.getMedicineId()).append(",")
                   .append("\"").append(m.getMedicineName().replace("\"", "\"\"")).append("\",")
                   .append("\"").append((m.getGenericName() != null ? m.getGenericName() : "").replace("\"", "\"\"")).append("\",")
                   .append("\"").append(cat.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(supp.replace("\"", "\"\"")).append("\",")
                   .append("\"").append((m.getDosage() != null ? m.getDosage() : "").replace("\"", "\"\"")).append("\",")
                   .append("\"").append((m.getUnit() != null ? m.getUnit() : "").replace("\"", "\"\"")).append("\",")
                   .append("\"").append((m.getManufacturer() != null ? m.getManufacturer() : "").replace("\"", "\"\"")).append("\",")
                   .append(m.getManufactureDate()).append(",")
                   .append(m.getExpiryDate()).append(",")
                   .append(m.getPurchasePrice()).append(",")
                   .append(m.getSellingPrice()).append(",")
                   .append("\"").append((m.getBarcode() != null ? m.getBarcode() : "").replace("\"", "\"\"")).append("\"\n");
            }
        }
        else if ("supplier".equalsIgnoreCase(type)) {
            csv.append("Supplier ID,Supplier Name,Contact Person,Phone,Email,Status\n");
            List<Supplier> list = supplierRepository.findAll();
            for (Supplier s : list) {
                csv.append(s.getSupplierId()).append(",")
                   .append("\"").append(s.getSupplierName().replace("\"", "\"\"")).append("\",")
                   .append("\"").append((s.getContactPerson() != null ? s.getContactPerson() : "").replace("\"", "\"\"")).append("\",")
                   .append("\"").append(s.getPhone() != null ? s.getPhone() : "").append("\",")
                   .append("\"").append(s.getEmail() != null ? s.getEmail() : "").append("\",")
                   .append(s.getStatus() != null && s.getStatus() ? "Active" : "Inactive").append("\n");
            }
        } 
        else if ("purchase".equalsIgnoreCase(type)) {
            csv.append("Purchase Order ID,Supplier Name,Ordered By,Order Date,Total Amount,Status\n");
            List<PurchaseOrder> list = purchaseOrderRepository.findAll();
            for (PurchaseOrder po : list) {
                String supp = po.getSupplier() != null ? po.getSupplier().getSupplierName() : "Unknown";
                String user = po.getOrderedBy() != null ? po.getOrderedBy().getEmail() : "Unknown";
                csv.append(po.getPurchaseOrderId()).append(",")
                   .append("\"").append(supp.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(user.replace("\"", "\"\"")).append("\",")
                   .append(po.getOrderDate()).append(",")
                   .append(po.getTotalAmount()).append(",")
                   .append(po.getStatus()).append("\n");
            }
        } 
        else if ("expiry".equalsIgnoreCase(type)) {
            csv.append("Medicine ID,Medicine Name,Batch,Expiry Date,Days Remaining,Status\n");
            List<ExpiryAlertResponse> list = expiryService.getExpiryAlerts();
            for (ExpiryAlertResponse alert : list) {
                csv.append(alert.getMedicineId()).append(",")
                   .append("\"").append(alert.getMedicineName().replace("\"", "\"\"")).append("\",")
                   .append("\"").append(alert.getBatchNumber().replace("\"", "\"\"")).append("\",")
                   .append(alert.getExpiryDate()).append(",")
                   .append(alert.getDaysRemaining()).append(",")
                   .append(alert.getStatus()).append("\n");
            }
        } 
        else if ("out-of-stock".equalsIgnoreCase(type)) {
            csv.append("Inventory ID,Medicine Name,Category,Batch Number,Supplier,Minimum Stock,Status\n");
            List<Inventory> list = inventoryRepository.findAll();
            for (Inventory item : list) {
                if (item.getQuantity() == 0) {
                    Medicine m = item.getMedicine();
                    String name = m != null ? m.getMedicineName() : "Unknown";
                    String cat = (m != null && m.getCategory() != null) ? m.getCategory().getCategoryName() : "General";
                    String batch = m != null ? m.getBatchNumber() : "";
                    String supp = (m != null && m.getSupplier() != null) ? m.getSupplier().getSupplierName() : "Unknown";
                    csv.append(item.getInventoryId()).append(",")
                       .append("\"").append(name.replace("\"", "\"\"")).append("\",")
                       .append("\"").append(cat.replace("\"", "\"\"")).append("\",")
                       .append("\"").append(batch.replace("\"", "\"\"")).append("\",")
                       .append("\"").append(supp.replace("\"", "\"\"")).append("\",")
                       .append(item.getMinimumStock()).append(",")
                       .append("Out of Stock\n");
                }
            }
        }
        else if ("stock-movement".equalsIgnoreCase(type)) {
            csv.append("Log ID,Medicine Name,Batch Number,Action,Old Quantity,New Quantity,Change,Operator,Reason,Updated At\n");
            List<StockLog> logs = stockLogRepository.findAll();
            for (StockLog log : logs) {
                String name = log.getMedicine() != null ? log.getMedicine().getMedicineName() : "Unknown";
                String batch = log.getMedicine() != null ? log.getMedicine().getBatchNumber() : "";
                int change = log.getNewQuantity() - log.getOldQuantity();
                String operator = log.getUser() != null ? log.getUser().getEmail() : "System";
                String reason = log.getReason() != null ? log.getReason() : "N/A";
                csv.append(log.getStockLogId()).append(",")
                   .append("\"").append(name.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(batch.replace("\"", "\"\"")).append("\",")
                   .append(log.getAction()).append(",")
                   .append(log.getOldQuantity()).append(",")
                   .append(log.getNewQuantity()).append(",")
                   .append(change).append(",")
                   .append("\"").append(operator.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(reason.replace("\"", "\"\"")).append("\",")
                   .append(log.getUpdatedAt()).append("\n");
            }
        }
        else if ("notifications".equalsIgnoreCase(type)) {
            csv.append("Notification ID,Recipient,Title,Message,Type,Priority,Module,Created At,Is Read\n");
            List<Notification> list = notificationRepository.findAll();
            for (Notification n : list) {
                String user = n.getUser() != null ? n.getUser().getEmail() : "All Users";
                csv.append(n.getNotificationId()).append(",")
                   .append("\"").append(user.replace("\"", "\"\"")).append("\",")
                   .append("\"").append(n.getTitle().replace("\"", "\"\"")).append("\",")
                   .append("\"").append(n.getMessage().replace("\"", "\"\"")).append("\",")
                   .append(n.getType()).append(",")
                   .append(n.getPriority()).append(",")
                   .append(n.getRelatedModule()).append(",")
                   .append(n.getCreatedAt()).append(",")
                   .append(n.getIsRead()).append("\n");
            }
        }
        else {
            csv.append("Invalid Report Type Specified");
        }

        return csv.toString();
    }

    @Override
    @Transactional(readOnly = true)
    public List<?> getReportData(String type) {
        if ("inventory-summary".equalsIgnoreCase(type)) {
            long totalMedicines = medicineRepository.count();
            BigDecimal totalVal = BigDecimal.ZERO;
            long lowStock = 0;
            long expired = 0;
            java.time.LocalDate today = java.time.LocalDate.now();

            List<Inventory> list = inventoryRepository.findAll();
            for (Inventory item : list) {
                BigDecimal price = (item.getMedicine() != null && item.getMedicine().getPurchasePrice() != null)
                        ? item.getMedicine().getPurchasePrice()
                        : BigDecimal.ZERO;
                totalVal = totalVal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));

                int minStock = item.getMinimumStock() != null ? item.getMinimumStock() : 10;
                if (item.getQuantity() <= minStock) {
                    lowStock++;
                }

                if (item.getMedicine() != null && item.getMedicine().getExpiryDate() != null) {
                    if (item.getMedicine().getExpiryDate().isBefore(today)) {
                        expired++;
                    }
                }
            }
            java.util.Map<String, Object> summary = new java.util.HashMap<>();
            summary.put("totalMedicines", totalMedicines);
            summary.put("inventoryValue", totalVal);
            summary.put("lowStockCount", lowStock);
            summary.put("expiredCount", expired);
            return java.util.Collections.singletonList(summary);
        }
        else if ("current-stock".equalsIgnoreCase(type) || "inventory".equalsIgnoreCase(type)) {
            List<Inventory> list = inventoryRepository.findAll();
            return list.stream().map(item -> {
                Medicine m = item.getMedicine();
                String name = m != null ? m.getMedicineName() : "Unknown";
                String cat = (m != null && m.getCategory() != null) ? m.getCategory().getCategoryName() : "General";
                BigDecimal sellingPrice = m != null && m.getSellingPrice() != null ? m.getSellingPrice() : BigDecimal.ZERO;
                BigDecimal purchasePrice = m != null && m.getPurchasePrice() != null ? m.getPurchasePrice() : BigDecimal.ZERO;
                BigDecimal totalVal = purchasePrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                String batch = m != null ? m.getBatchNumber() : "";
                
                String expiryStatus = "Safe";
                Long daysRemaining = null;
                if (m != null && m.getExpiryDate() != null) {
                    daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), m.getExpiryDate());
                    if (daysRemaining < 0) {
                        expiryStatus = "Expired";
                    } else if (daysRemaining <= 30) {
                        expiryStatus = "Critical";
                    } else if (daysRemaining <= 60) {
                        expiryStatus = "Expiring Soon";
                    }
                }

                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("medicineId", m != null ? m.getMedicineId() : null);
                map.put("medicineName", name);
                map.put("categoryName", cat);
                map.put("batchNumber", batch);
                map.put("quantity", item.getQuantity());
                map.put("minimumStock", item.getMinimumStock());
                map.put("sellingPrice", sellingPrice);
                map.put("purchasePrice", purchasePrice);
                map.put("totalValue", totalVal);
                map.put("expiryStatus", expiryStatus);
                map.put("daysRemaining", daysRemaining);
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("medicine".equalsIgnoreCase(type)) {
            List<Medicine> list = medicineRepository.findAll();
            return list.stream().map(m -> {
                String cat = m.getCategory() != null ? m.getCategory().getCategoryName() : "General";
                String supp = m.getSupplier() != null ? m.getSupplier().getSupplierName() : "Unknown";
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("medicineId", m.getMedicineId());
                map.put("medicineName", m.getMedicineName());
                map.put("genericName", m.getGenericName());
                map.put("categoryName", cat);
                map.put("supplierName", supp);
                map.put("purchasePrice", m.getPurchasePrice());
                map.put("sellingPrice", m.getSellingPrice());
                map.put("expiryDate", m.getExpiryDate());
                map.put("dosage", m.getDosage());
                map.put("unit", m.getUnit());
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("supplier".equalsIgnoreCase(type)) {
            List<Supplier> list = supplierRepository.findAll();
            return list.stream().map(s -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("supplierId", s.getSupplierId());
                map.put("supplierName", s.getSupplierName());
                map.put("contactPerson", s.getContactPerson());
                map.put("phone", s.getPhone());
                map.put("email", s.getEmail());
                map.put("status", s.getStatus() != null && s.getStatus() ? "Active" : "Inactive");
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("expired-medicines".equalsIgnoreCase(type)) {
            java.time.LocalDate today = java.time.LocalDate.now();
            List<Inventory> list = inventoryRepository.findAll();
            return list.stream()
                .filter(item -> item.getMedicine() != null && item.getMedicine().getExpiryDate() != null && item.getMedicine().getExpiryDate().isBefore(today))
                .map(item -> {
                    Medicine m = item.getMedicine();
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("medicineId", m.getMedicineId());
                    map.put("medicineName", m.getMedicineName());
                    map.put("batchNumber", m.getBatchNumber());
                    map.put("expiryDate", m.getExpiryDate());
                    map.put("quantity", item.getQuantity());
                    long days = java.time.temporal.ChronoUnit.DAYS.between(today, m.getExpiryDate());
                    map.put("daysRemaining", days);
                    map.put("status", "Expired");
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("expiring-soon".equalsIgnoreCase(type)) {
            java.time.LocalDate today = java.time.LocalDate.now();
            List<Inventory> list = inventoryRepository.findAll();
            return list.stream()
                .filter(item -> {
                    if (item.getMedicine() == null || item.getMedicine().getExpiryDate() == null) return false;
                    long days = java.time.temporal.ChronoUnit.DAYS.between(today, item.getMedicine().getExpiryDate());
                    return days >= 0 && days <= 60;
                })
                .map(item -> {
                    Medicine m = item.getMedicine();
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("medicineId", m.getMedicineId());
                    map.put("medicineName", m.getMedicineName());
                    map.put("batchNumber", m.getBatchNumber());
                    map.put("expiryDate", m.getExpiryDate());
                    map.put("quantity", item.getQuantity());
                    long days = java.time.temporal.ChronoUnit.DAYS.between(today, m.getExpiryDate());
                    map.put("daysRemaining", days);
                    map.put("status", days <= 30 ? "Critical" : "Expiring Soon");
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("expiry".equalsIgnoreCase(type)) {
            List<ExpiryAlertResponse> list = expiryService.getExpiryAlerts();
            return list.stream().map(alert -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("medicineId", alert.getMedicineId());
                map.put("medicineName", alert.getMedicineName());
                map.put("batchNumber", alert.getBatchNumber());
                map.put("expiryDate", alert.getExpiryDate());
                map.put("daysRemaining", alert.getDaysRemaining());
                map.put("status", alert.getStatus());
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("low-stock".equalsIgnoreCase(type)) {
            List<Inventory> list = inventoryRepository.findAll();
            return list.stream()
                .filter(item -> item.getQuantity() <= (item.getMinimumStock() != null ? item.getMinimumStock() : 10))
                .map(item -> {
                    Medicine m = item.getMedicine();
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("medicineId", m != null ? m.getMedicineId() : null);
                    map.put("medicineName", m != null ? m.getMedicineName() : "Unknown");
                    map.put("batchNumber", m != null ? m.getBatchNumber() : "");
                    map.put("quantity", item.getQuantity());
                    map.put("minimumStock", item.getMinimumStock());
                    map.put("status", "Low Stock");
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("out-of-stock".equalsIgnoreCase(type)) {
            List<Inventory> list = inventoryRepository.findAll();
            return list.stream()
                .filter(item -> item.getQuantity() == 0)
                .map(item -> {
                    Medicine m = item.getMedicine();
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("medicineId", m != null ? m.getMedicineId() : null);
                    map.put("medicineName", m != null ? m.getMedicineName() : "Unknown");
                    map.put("batchNumber", m != null ? m.getBatchNumber() : "");
                    map.put("supplierName", (m != null && m.getSupplier() != null) ? m.getSupplier().getSupplierName() : "Unknown");
                    map.put("minimumStock", item.getMinimumStock());
                    map.put("status", "Out of Stock");
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("stock-in".equalsIgnoreCase(type)) {
            List<StockLog> logs = stockLogRepository.findAll();
            return logs.stream()
                .filter(log -> "STOCK_IN".equalsIgnoreCase(log.getAction()) || "CREATE".equalsIgnoreCase(log.getAction()))
                .map(log -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("stockLogId", log.getStockLogId());
                    map.put("medicineName", log.getMedicine() != null ? log.getMedicine().getMedicineName() : "Unknown");
                    map.put("batchNumber", log.getMedicine() != null ? log.getMedicine().getBatchNumber() : "");
                    map.put("action", log.getAction());
                    map.put("oldQuantity", log.getOldQuantity());
                    map.put("newQuantity", log.getNewQuantity());
                    map.put("change", log.getNewQuantity() - log.getOldQuantity());
                    map.put("operator", log.getUser() != null ? log.getUser().getEmail() : "System");
                    map.put("reason", log.getReason() != null ? log.getReason() : "N/A");
                    map.put("updatedAt", log.getUpdatedAt());
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("stock-out".equalsIgnoreCase(type)) {
            List<StockLog> logs = stockLogRepository.findAll();
            return logs.stream()
                .filter(log -> "STOCK_OUT".equalsIgnoreCase(log.getAction()))
                .map(log -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("stockLogId", log.getStockLogId());
                    map.put("medicineName", log.getMedicine() != null ? log.getMedicine().getMedicineName() : "Unknown");
                    map.put("batchNumber", log.getMedicine() != null ? log.getMedicine().getBatchNumber() : "");
                    map.put("action", log.getAction());
                    map.put("oldQuantity", log.getOldQuantity());
                    map.put("newQuantity", log.getNewQuantity());
                    map.put("change", log.getOldQuantity() - log.getNewQuantity());
                    map.put("operator", log.getUser() != null ? log.getUser().getEmail() : "System");
                    map.put("reason", log.getReason() != null ? log.getReason() : "N/A");
                    map.put("updatedAt", log.getUpdatedAt());
                    return map;
                }).collect(java.util.stream.Collectors.toList());
        }
        else if ("stock-movement".equalsIgnoreCase(type)) {
            List<StockLog> logs = stockLogRepository.findAll();
            return logs.stream().map(log -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("stockLogId", log.getStockLogId());
                map.put("medicineName", log.getMedicine() != null ? log.getMedicine().getMedicineName() : "Unknown");
                map.put("batchNumber", log.getMedicine() != null ? log.getMedicine().getBatchNumber() : "");
                map.put("action", log.getAction());
                map.put("oldQuantity", log.getOldQuantity());
                map.put("newQuantity", log.getNewQuantity());
                map.put("change", log.getNewQuantity() - log.getOldQuantity());
                map.put("operator", log.getUser() != null ? log.getUser().getEmail() : "System");
                map.put("reason", log.getReason() != null ? log.getReason() : "N/A");
                map.put("updatedAt", log.getUpdatedAt());
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("purchase".equalsIgnoreCase(type)) {
            List<PurchaseOrder> list = purchaseOrderRepository.findAll();
            return list.stream().map(po -> {
                String supp = po.getSupplier() != null ? po.getSupplier().getSupplierName() : "Unknown";
                String user = po.getOrderedBy() != null ? po.getOrderedBy().getEmail() : "Unknown";
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("purchaseOrderId", po.getPurchaseOrderId());
                map.put("supplierName", supp);
                map.put("orderedBy", user);
                map.put("orderDate", po.getOrderDate());
                map.put("totalAmount", po.getTotalAmount());
                map.put("status", po.getStatus());
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        else if ("notifications".equalsIgnoreCase(type)) {
            List<Notification> list = notificationRepository.findAll();
            return list.stream().map(n -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("notificationId", n.getNotificationId());
                map.put("recipient", n.getUser() != null ? n.getUser().getEmail() : "All Users");
                map.put("title", n.getTitle());
                map.put("message", n.getMessage());
                map.put("type", n.getType());
                map.put("priority", n.getPriority());
                map.put("module", n.getRelatedModule());
                map.put("createdAt", n.getCreatedAt());
                map.put("isRead", n.getIsRead());
                return map;
            }).collect(java.util.stream.Collectors.toList());
        }
        return java.util.Collections.emptyList();
    }
}
