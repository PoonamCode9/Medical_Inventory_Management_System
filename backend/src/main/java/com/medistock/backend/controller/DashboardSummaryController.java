package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.dto.response.MedicineResponse;
import com.medistock.backend.dto.response.NotificationResponse;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Category;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.repository.*;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardSummaryController {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationRepository notificationRepository;
    private final StockLogRepository stockLogRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER', 'STAFF', 'USER')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboardSummary(Principal principal) {
        try {
            LocalDate today = LocalDate.now();

            // 1. Core KPIs
            long totalMedicines = medicineRepository.count();
            long totalSuppliers = supplierRepository.count();
            long totalUsers = userRepository.count();
            long totalPurchaseOrders = purchaseOrderRepository.count();
            long totalCategories = categoryRepository.count();

            long totalInventoryQuantity = inventoryRepository.sumTotalQuantity();
            BigDecimal totalVal = inventoryRepository.sumInventoryValue();
            if (totalVal == null) totalVal = BigDecimal.ZERO;

            long availableStock = inventoryRepository.countAvailableStock();
            long lowStockCount = inventoryRepository.countLowStock();
            long outOfStockCount = inventoryRepository.countOutOfStock();
            long goodStockCount = inventoryRepository.countGoodStock();
            long criticalStockCount = inventoryRepository.countCriticalStock();

            // Expiry KPIs
            long expiredMedicines = medicineRepository.countExpired(today);
            long expiring7Days = medicineRepository.countExpiringBetween(today, today.plusDays(7));
            long expiring30Days = medicineRepository.countExpiringBetween(today, today.plusDays(30));
            long expiringSoonMedicines = medicineRepository.countExpiringBetween(today, today.plusDays(60));
            long criticalMedicines = medicineRepository.countExpiringBetween(today, today.plusDays(30));
            long safeMedicines = medicineRepository.countSafe(today.plusDays(30));

            // 2. Stock Health distribution
            List<CategoryMetric> categoryMetrics = new ArrayList<>();
            try {
                List<Object[]> catMetricsData = medicineRepository.findCategoryMetrics();
                for (Object[] row : catMetricsData) {
                    if (row != null && row[0] != null) {
                        categoryMetrics.add(new CategoryMetric((String) row[0], row[1] != null ? ((Number) row[1]).longValue() : 0L));
                    }
                }
            } catch (Exception ex) {
                log.warn("Category metrics query exception: {}", ex.getMessage());
            }

            // 3. Purchase Order status counts
            long pendingPurchaseOrders = 0;
            long approvedPurchaseOrders = 0;
            long completedPurchaseOrders = 0;
            long cancelledPurchaseOrders = 0;

            try {
                List<Object[]> poStatusCounts = purchaseOrderRepository.countOrdersByStatus();
                for (Object[] row : poStatusCounts) {
                    if (row != null && row[0] != null) {
                        String status = (String) row[0];
                        long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                        if ("PENDING".equalsIgnoreCase(status)) {
                            pendingPurchaseOrders = count;
                        } else if ("APPROVED".equalsIgnoreCase(status) || "ORDERED".equalsIgnoreCase(status)) {
                            approvedPurchaseOrders = count;
                        } else if ("DELIVERED".equalsIgnoreCase(status) || "RECEIVED".equalsIgnoreCase(status)) {
                            completedPurchaseOrders = count;
                        } else if ("CANCELLED".equalsIgnoreCase(status)) {
                            cancelledPurchaseOrders = count;
                        }
                    }
                }
            } catch (Exception ex) {
                log.warn("PO status count query exception: {}", ex.getMessage());
            }

            // 4. Supplier statistics
            long activeSuppliers = supplierRepository.countActiveSuppliers();
            long inactiveSuppliers = supplierRepository.countInactiveSuppliers();
            Double avgVolObj = null;
            try {
                avgVolObj = purchaseOrderRepository.getAveragePurchaseVolume();
            } catch (Exception ex) {
                log.warn("Average purchase volume query exception: {}", ex.getMessage());
            }
            double avgPurchaseVolume = avgVolObj != null ? avgVolObj : 0.0;

            String topSupplierVolume = "None";
            try {
                List<Object[]> topSupplierData = purchaseOrderRepository.findTopSupplierByVolume();
                if (!topSupplierData.isEmpty() && topSupplierData.get(0)[0] != null) {
                    topSupplierVolume = (String) topSupplierData.get(0)[0];
                }
            } catch (Exception ex) {
                log.warn("Top supplier volume query exception: {}", ex.getMessage());
            }

            String supplierHighestMeds = "None";
            try {
                List<Object[]> highestMedsData = medicineRepository.findSupplierMedicineCounts();
                if (!highestMedsData.isEmpty() && highestMedsData.get(0)[0] != null) {
                    supplierHighestMeds = (String) highestMedsData.get(0)[0];
                }
            } catch (Exception ex) {
                log.warn("Supplier medicine count query exception: {}", ex.getMessage());
            }

            // 5. Notification Metrics
            LocalDateTime startOfToday = today.atStartOfDay();
            long notificationsToday = notificationRepository.countNotificationsSince(startOfToday);
            long unreadNotifications = notificationRepository.countNotificationsByIsRead(false);
            long readNotifications = notificationRepository.countNotificationsByIsRead(true);
            long expiryNotifications = notificationRepository.countNotificationsByTypes(List.of("EXPIRY", "EXPIRY_ALERT", "EXPIRED"));
            long lowStockNotifications = notificationRepository.countNotificationsByTypes(List.of("LOW_STOCK", "OUT_OF_STOCK"));
            long purchaseNotifications = notificationRepository.countNotificationsByTypes(List.of("PURCHASE", "PURCHASE_DELIVERED"));

            long adminPharmacistCount = userRepository.countAdminsAndPharmacists();
            long emailNotificationsSent = notificationRepository.countImportantNotifications() * adminPharmacistCount;

            // 6. User activity logs counts
            long adminActivity = 0;
            long pharmacistActivity = 0;
            long staffActivity = 0;
            
            try {
                List<Object[]> logCounts = stockLogRepository.findAll().stream()
                        .filter(l -> l.getUser() != null && l.getUser().getRole() != null)
                        .collect(Collectors.groupingBy(l -> l.getUser().getRole().getRoleName(), Collectors.counting()))
                        .entrySet().stream()
                        .map(e -> new Object[]{e.getKey(), e.getValue()})
                        .collect(Collectors.toList());

                for (Object[] row : logCounts) {
                    String roleName = (String) row[0];
                    long count = (Long) row[1];
                    if ("ADMIN".equalsIgnoreCase(roleName)) {
                        adminActivity = count;
                    } else if ("PHARMACIST".equalsIgnoreCase(roleName)) {
                        pharmacistActivity = count;
                    } else if ("STAFF".equalsIgnoreCase(roleName) || "USER".equalsIgnoreCase(roleName)) {
                        staffActivity = count;
                    }
                }
            } catch (Exception ex) {
                log.warn("Log counts aggregation exception: {}", ex.getMessage());
            }

            // 7. Reports generated
            long totalReportsGenerated = notificationRepository.findAll().stream()
                    .filter(n -> "REPORT".equalsIgnoreCase(n.getRelatedModule()))
                    .count();
            long pdfDownloads = notificationRepository.findAll().stream()
                    .filter(n -> "REPORT".equalsIgnoreCase(n.getRelatedModule()) && n.getMessage() != null && n.getMessage().toLowerCase().contains("pdf"))
                    .count();
            long excelDownloads = notificationRepository.findAll().stream()
                    .filter(n -> "REPORT".equalsIgnoreCase(n.getRelatedModule()) && n.getMessage() != null && n.getMessage().toLowerCase().contains("excel"))
                    .count();

            // 8. Recent entities mappings
            List<NotificationResponse> recentNotifications = notificationRepository.findAll().stream()
                    .filter(n -> n.getCreatedAt() != null)
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(10)
                    .map(this::mapToNotificationResponse)
                    .collect(Collectors.toList());

            List<com.medistock.backend.dto.response.StockLogResponse> recentStockLogs = stockLogRepository.findAll().stream()
                    .filter(l -> l.getUpdatedAt() != null)
                    .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                    .limit(10)
                    .map(this::mapToStockLogResponse)
                    .collect(Collectors.toList());

            List<RecentPurchaseOrderDto> recentPurchaseOrders = purchaseOrderRepository.findAll().stream()
                    .filter(po -> po.getPurchaseOrderId() != null)
                    .sorted((a, b) -> b.getPurchaseOrderId().compareTo(a.getPurchaseOrderId()))
                    .limit(5)
                    .map(po -> RecentPurchaseOrderDto.builder()
                            .purchaseOrderId(po.getPurchaseOrderId())
                            .supplierName(po.getSupplier() != null ? po.getSupplier().getSupplierName() : "Unknown")
                            .orderDate(po.getOrderDate() != null ? po.getOrderDate().toString() : "")
                            .totalAmount(po.getTotalAmount())
                            .status(po.getStatus())
                            .build())
                    .collect(Collectors.toList());

            List<com.medistock.backend.entity.Supplier> recentSuppliers = supplierRepository.findAll().stream()
                    .filter(s -> s.getSupplierId() != null)
                    .sorted((a, b) -> b.getSupplierId().compareTo(a.getSupplierId()))
                    .limit(5)
                    .collect(Collectors.toList());

            List<MedicineResponse> recentMedicines = medicineRepository.findAll().stream()
                    .filter(m -> m.getMedicineId() != null)
                    .sorted((a, b) -> b.getMedicineId().compareTo(a.getMedicineId()))
                    .limit(5)
                    .map(this::mapToMedicineResponse)
                    .collect(Collectors.toList());

            // 9. Health indicators & Scores
            double inventoryHealthScore = 100.0;
            if (totalMedicines > 0) {
                inventoryHealthScore = ((double) (totalMedicines - lowStockCount - outOfStockCount) / totalMedicines) * 100.0;
            }

            double stockHealthIndicator = totalMedicines > 0 ? ((double) goodStockCount / totalMedicines) * 100.0 : 100.0;
            double expiryHealthIndicator = totalMedicines > 0 ? ((double) safeMedicines / totalMedicines) * 100.0 : 100.0;
            double supplierHealthIndicator = totalSuppliers > 0 ? ((double) activeSuppliers / totalSuppliers) * 100.0 : 100.0;

            // Supplier lists
            List<SupplierPerformanceDto> supplierPerformance = new ArrayList<>();
            try {
                List<Object[]> suppPurchaseData = purchaseOrderRepository.findSupplierPurchaseOrderCountsAndValue();
                for (Object[] row : suppPurchaseData) {
                    if (row != null && row[0] != null) {
                        String name = (String) row[0];
                        long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                        BigDecimal val = row.length > 2 && row[2] != null ? BigDecimal.valueOf(((Number) row[2]).doubleValue()) : BigDecimal.ZERO;
                        supplierPerformance.add(SupplierPerformanceDto.builder()
                                .supplierName(name)
                                .purchaseCount(count)
                                .totalValue(val)
                                .build());
                    }
                }
            } catch (Exception ex) {
                log.warn("Supplier performance query exception: {}", ex.getMessage());
            }

            // Supplier-wise inventory value calculation
            List<SupplierInventoryValueDto> supplierInventoryValue = new ArrayList<>();
            Map<String, BigDecimal> suppVal = new HashMap<>();
            for (Inventory inv : inventoryRepository.findAll()) {
                if (inv.getMedicine() != null && inv.getMedicine().getSupplier() != null) {
                    String sName = inv.getMedicine().getSupplier().getSupplierName();
                    BigDecimal price = inv.getMedicine().getSellingPrice() != null ? inv.getMedicine().getSellingPrice() : (inv.getMedicine().getUnitPrice() != null ? inv.getMedicine().getUnitPrice() : BigDecimal.ZERO);
                    BigDecimal itemVal = price.multiply(BigDecimal.valueOf(inv.getQuantity()));
                    suppVal.put(sName, suppVal.getOrDefault(sName, BigDecimal.ZERO).add(itemVal));
                }
            }
            suppVal.forEach((sName, value) -> {
                supplierInventoryValue.add(new SupplierInventoryValueDto(sName, value));
            });

            // Monthly purchases trend
            List<MonthlyPurchaseTrendDto> monthlyPurchases = new ArrayList<>();
            try {
                List<PurchaseOrder> allPOs = purchaseOrderRepository.findAll();
                Map<String, Double> monthlyAmountMap = allPOs.stream()
                        .filter(po -> po.getOrderDate() != null)
                        .collect(Collectors.groupingBy(
                                po -> po.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                                Collectors.summingDouble(po -> po.getTotalAmount() != null ? po.getTotalAmount().doubleValue() : 0.0)
                        ));
                monthlyAmountMap.forEach((month, amount) -> {
                    monthlyPurchases.add(new MonthlyPurchaseTrendDto(month, amount));
                });
                monthlyPurchases.sort(Comparator.comparing(MonthlyPurchaseTrendDto::getMonth));
            } catch (Exception ex) {
                log.warn("Monthly purchases processing exception: {}", ex.getMessage());
            }

            // Stock-in vs Stock-out metrics
            long totalStockIn = 0;
            long totalStockOut = 0;
            try {
                for (com.medistock.backend.entity.StockLog logEntry : stockLogRepository.findAll()) {
                    int oldQ = logEntry.getOldQuantity() != null ? logEntry.getOldQuantity() : 0;
                    int newQ = logEntry.getNewQuantity() != null ? logEntry.getNewQuantity() : 0;
                    String act = logEntry.getAction() != null ? logEntry.getAction().toUpperCase() : "";
                    if (act.contains("IN") || act.contains("CREATE") || act.contains("RESTOCK") || act.contains("COMPLETED")) {
                        totalStockIn += Math.max(0, newQ - oldQ);
                    } else if (act.contains("OUT") || act.contains("DELETE") || act.contains("DISPENSE")) {
                        totalStockOut += Math.max(0, oldQ - newQ);
                    } else if (act.contains("ADJUST") || act.contains("BUFFER")) {
                        if (newQ > oldQ) {
                            totalStockIn += (newQ - oldQ);
                        } else {
                            totalStockOut += (oldQ - newQ);
                        }
                    }
                }
            } catch (Exception ex) {
                log.warn("Stock movement calculation exception: {}", ex.getMessage());
            }

            DashboardSummary summary = DashboardSummary.builder()
                    .totalMedicines(totalMedicines)
                    .inventoryValue(totalVal)
                    .suppliers(totalSuppliers)
                    .users(totalUsers)
                    .lowStock(lowStockCount)
                    .outOfStock(outOfStockCount)
                    .goodStock(goodStockCount)
                    .criticalStock(criticalStockCount)
                    .expiringMedicines(criticalMedicines + expiringSoonMedicines)
                    .expiredMedicines(expiredMedicines)
                    .expiringSoonMedicines(expiringSoonMedicines)
                    .criticalMedicines(criticalMedicines)
                    .safeMedicines(safeMedicines)
                    .totalCategories(totalCategories)
                    .purchaseOrders(totalPurchaseOrders)
                    .totalInventoryQuantity(totalInventoryQuantity)
                    .pendingPurchaseOrders(pendingPurchaseOrders)
                    .completedPurchaseOrders(completedPurchaseOrders)
                    .categoryMetrics(categoryMetrics)
                    .recentNotifications(recentNotifications)
                    .recentStockLogs(recentStockLogs)
                    .recentPurchaseOrders(recentPurchaseOrders)
                    .recentSuppliers(recentSuppliers)
                    .recentMedicines(recentMedicines)
                    
                    // Analytics Extensions
                    .availableStock(availableStock)
                    .expiring7Days(expiring7Days)
                    .expiring30Days(expiring30Days)
                    .approvedPurchaseOrders(approvedPurchaseOrders)
                    .cancelledPurchaseOrders(cancelledPurchaseOrders)
                    .activeSuppliers(activeSuppliers)
                    .inactiveSuppliers(inactiveSuppliers)
                    .topPerformingSupplier(topSupplierVolume)
                    .supplierHighestMedicines(supplierHighestMeds)
                    .averagePurchaseVolume(avgPurchaseVolume)
                    
                    // User & activity statistics
                    .adminActivity(adminActivity)
                    .pharmacistActivity(pharmacistActivity)
                    .staffActivity(staffActivity)
                    
                    // Notifications KPIs
                    .notificationsToday(notificationsToday)
                    .unreadNotifications(unreadNotifications)
                    .readNotifications(readNotifications)
                    .expiryNotifications(expiryNotifications)
                    .lowStockNotifications(lowStockNotifications)
                    .purchaseNotifications(purchaseNotifications)
                    .emailNotificationsSent(emailNotificationsSent)
                    
                    // Reports analytics
                    .totalReportsGenerated(totalReportsGenerated)
                    .pdfDownloads(pdfDownloads)
                    .excelDownloads(excelDownloads)
                    
                    // Scores & Charts
                    .inventoryHealthScore(inventoryHealthScore)
                    .stockHealthIndicator(stockHealthIndicator)
                    .expiryHealthIndicator(expiryHealthIndicator)
                    .supplierHealthIndicator(supplierHealthIndicator)
                    .supplierPerformance(supplierPerformance)
                    .supplierInventoryValue(supplierInventoryValue)
                    .monthlyPurchases(monthlyPurchases)
                    .totalStockIn(totalStockIn)
                    .totalStockOut(totalStockOut)
                    .build();

            return ResponseEntity.ok(ApiResponse.<DashboardSummary>builder()
                    .success(true)
                    .message("Fetched dashboard summaries.")
                    .data(summary)
                    .build());
        } catch (Throwable t) {
            log.error("Fatal exception during getDashboardSummary generation: ", t);
            // Return empty fallback summary to ensure UI never fails with HTTP 500
            DashboardSummary fallback = DashboardSummary.builder()
                    .inventoryValue(BigDecimal.ZERO)
                    .categoryMetrics(new ArrayList<>())
                    .recentNotifications(new ArrayList<>())
                    .recentStockLogs(new ArrayList<>())
                    .recentPurchaseOrders(new ArrayList<>())
                    .recentSuppliers(new ArrayList<>())
                    .recentMedicines(new ArrayList<>())
                    .supplierPerformance(new ArrayList<>())
                    .supplierInventoryValue(new ArrayList<>())
                    .monthlyPurchases(new ArrayList<>())
                    .build();
            return ResponseEntity.ok(ApiResponse.<DashboardSummary>builder()
                    .success(true)
                    .message("Fetched dashboard summary fallback.")
                    .data(fallback)
                    .build());
        }
    }

    @Data
    @Builder
    public static class DashboardSummary {
        private double stockHealthIndicator;
        private double expiryHealthIndicator;
        private double supplierHealthIndicator;
        private List<SupplierInventoryValueDto> supplierInventoryValue;
        private long totalMedicines;
        private BigDecimal inventoryValue;
        private long suppliers;
        private long users;
        private long lowStock;
        private long outOfStock;
        private long goodStock;
        private long criticalStock;
        private long expiringMedicines;
        private long expiredMedicines;
        private long expiringSoonMedicines;
        private long criticalMedicines;
        private long safeMedicines;
        private long totalCategories;
        private long purchaseOrders;
        private long totalInventoryQuantity;
        private long pendingPurchaseOrders;
        private long completedPurchaseOrders;
        
        // Lists
        private List<CategoryMetric> categoryMetrics;
        private List<NotificationResponse> recentNotifications;
        private List<com.medistock.backend.dto.response.StockLogResponse> recentStockLogs;
        private List<RecentPurchaseOrderDto> recentPurchaseOrders;
        private List<com.medistock.backend.entity.Supplier> recentSuppliers;
        private List<MedicineResponse> recentMedicines;

        // Analytics Extensions
        private long availableStock;
        private long expiring7Days;
        private long expiring30Days;
        private long approvedPurchaseOrders;
        private long cancelledPurchaseOrders;
        private long activeSuppliers;
        private long inactiveSuppliers;
        private String topPerformingSupplier;
        private String supplierHighestMedicines;
        private double averagePurchaseVolume;
        
        // Activities
        private long adminActivity;
        private long pharmacistActivity;
        private long staffActivity;
        
        // Notifications
        private long notificationsToday;
        private long unreadNotifications;
        private long readNotifications;
        private long expiryNotifications;
        private long lowStockNotifications;
        private long purchaseNotifications;
        private long emailNotificationsSent;

        // Reports
        private long totalReportsGenerated;
        private long pdfDownloads;
        private long excelDownloads;

        // Scores
        private double inventoryHealthScore;
        private List<SupplierPerformanceDto> supplierPerformance;
        private List<MonthlyPurchaseTrendDto> monthlyPurchases;
        private long totalStockIn;
        private long totalStockOut;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SupplierPerformanceDto {
        private String supplierName;
        private long purchaseCount;
        private BigDecimal totalValue;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SupplierInventoryValueDto {
        private String supplierName;
        private BigDecimal totalValue;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyPurchaseTrendDto {
        private String month;
        private double amount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentPurchaseOrderDto {
        private Integer purchaseOrderId;
        private String supplierName;
        private String orderDate;
        private BigDecimal totalAmount;
        private String status;
    }

    @Data
    @AllArgsConstructor
    public static class CategoryMetric {
        private String name;
        private long count;
    }

    private com.medistock.backend.dto.response.StockLogResponse mapToStockLogResponse(com.medistock.backend.entity.StockLog logEntry) {
        if (logEntry == null) return null;

        com.medistock.backend.dto.response.StockLogResponse.MedicineDto medicineDto = null;
        if (logEntry.getMedicine() != null) {
            medicineDto = com.medistock.backend.dto.response.StockLogResponse.MedicineDto.builder()
                    .medicineId(logEntry.getMedicine().getMedicineId())
                    .medicineName(logEntry.getMedicine().getMedicineName())
                    .batchNumber(logEntry.getMedicine().getBatchNumber())
                    .build();
        }

        com.medistock.backend.dto.response.StockLogResponse.UserDto userDto = null;
        if (logEntry.getUser() != null) {
            userDto = com.medistock.backend.dto.response.StockLogResponse.UserDto.builder()
                    .userId(logEntry.getUser().getUserId())
                    .email(logEntry.getUser().getEmail())
                    .build();
        }

        return com.medistock.backend.dto.response.StockLogResponse.builder()
                .stockLogId(logEntry.getStockLogId())
                .action(logEntry.getAction())
                .oldQuantity(logEntry.getOldQuantity())
                .newQuantity(logEntry.getNewQuantity())
                .updatedAt(logEntry.getUpdatedAt())
                .medicine(medicineDto)
                .user(userDto)
                .build();
    }

    private com.medistock.backend.dto.response.NotificationResponse mapToNotificationResponse(com.medistock.backend.entity.Notification n) {
        if (n == null) return null;
        return com.medistock.backend.dto.response.NotificationResponse.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser() != null ? n.getUser().getUserId() : null)
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .build();
    }

    private com.medistock.backend.dto.response.MedicineResponse mapToMedicineResponse(com.medistock.backend.entity.Medicine medicine) {
        if (medicine == null) return null;
        String catName = medicine.getCategory() != null ? medicine.getCategory().getCategoryName() : "General";
        Integer catId = medicine.getCategory() != null ? medicine.getCategory().getCategoryId() : null;
        String suppName = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierName() : "Default Supplier";
        Integer suppId = medicine.getSupplier() != null ? medicine.getSupplier().getSupplierId() : null;
        String suppEmail = medicine.getSupplier() != null ? medicine.getSupplier().getEmail() : "";
        String suppPhone = medicine.getSupplier() != null ? medicine.getSupplier().getPhone() : "";
        
        Integer qty = medicine.getInventory() != null ? medicine.getInventory().getQuantity() : 0;
        Integer minStock = medicine.getInventory() != null ? medicine.getInventory().getMinimumStock() : 10;

        Long daysUntilExpiry = null;
        String expiryStatus = "Safe";
        if (medicine.getExpiryDate() != null) {
            daysUntilExpiry = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.now(), medicine.getExpiryDate());
            if (daysUntilExpiry < 0) {
                expiryStatus = "Expired";
            } else if (daysUntilExpiry <= 30) {
                expiryStatus = "Critical";
            } else if (daysUntilExpiry <= 60) {
                expiryStatus = "Expiring Soon";
            } else {
                expiryStatus = "Safe";
            }
        }
        Boolean isLowStock = qty <= minStock;

        return com.medistock.backend.dto.response.MedicineResponse.builder()
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .categoryId(catId)
                .categoryName(catName)
                .supplierId(suppId)
                .supplierName(suppName)
                .supplierEmail(suppEmail)
                .supplierPhone(suppPhone)
                .batchNumber(medicine.getBatchNumber())
                .manufacturer(medicine.getManufacturer())
                .manufactureDate(medicine.getManufactureDate())
                .expiryDate(medicine.getExpiryDate())
                .purchasePrice(medicine.getPurchasePrice())
                .sellingPrice(medicine.getSellingPrice())
                .gst(medicine.getGst())
                .quantity(qty)
                .minimumStock(minStock)
                .barcode(medicine.getBarcode())
                .imageUrl(medicine.getImageUrl())
                .description(medicine.getDescription())
                .dosage(medicine.getDosage())
                .unit(medicine.getUnit())
                .daysUntilExpiry(daysUntilExpiry)
                .expiryStatus(expiryStatus)
                .isLowStock(isLowStock)
                .build();
    }
}
