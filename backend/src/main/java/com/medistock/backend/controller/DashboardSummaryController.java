package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.security.Principal;

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
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboardSummary(Principal principal) {
        LocalDate today = LocalDate.now();

        // 1. Executive KPIs (Using aggregation queries)
        long totalMedicines = medicineRepository.count();
        long totalSuppliers = supplierRepository.count();
        long totalUsers = userRepository.count();
        long totalPurchaseOrders = purchaseOrderRepository.count();
        long totalCategories = categoryRepository.count();

        long totalInventoryQuantity = inventoryRepository.sumTotalQuantity();
        BigDecimal totalVal = inventoryRepository.sumInventoryValue();
        long availableStock = inventoryRepository.countAvailableStock();
        long lowStockCount = inventoryRepository.countLowStock();
        long outOfStockCount = inventoryRepository.countOutOfStock();
        long goodStockCount = inventoryRepository.countGoodStock();
        long criticalStockCount = inventoryRepository.countCriticalStock();

        // Expiry aggregation
        long expiredMedicines = medicineRepository.countExpired(today);
        long expiring7Days = medicineRepository.countExpiringBetween(today, today.plusDays(7));
        long expiring30Days = medicineRepository.countExpiringBetween(today.plusDays(8), today.plusDays(30));
        long expiringSoonMedicines = medicineRepository.countExpiringBetween(today, today.plusDays(60));
        long criticalMedicines = medicineRepository.countExpiringBetween(today, today.plusDays(30));
        long safeMedicines = medicineRepository.countSafe(today.plusDays(30));

        // 2. Category Metrics
        List<CategoryMetric> categoryMetrics = new ArrayList<>();
        List<Object[]> catMetricsData = medicineRepository.findCategoryMetrics();
        for (Object[] row : catMetricsData) {
            categoryMetrics.add(new CategoryMetric((String) row[0], (Long) row[1]));
        }

        // 3. Purchase Order Metrics
        long pendingPurchaseOrders = 0;
        long approvedPurchaseOrders = 0;
        long completedPurchaseOrders = 0;
        long cancelledPurchaseOrders = 0;

        List<Object[]> poStatusCounts = purchaseOrderRepository.countOrdersByStatus();
        for (Object[] row : poStatusCounts) {
            String status = (String) row[0];
            long count = (Long) row[1];
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

        // 4. Supplier Metrics
        long activeSuppliers = supplierRepository.countActiveSuppliers();
        long inactiveSuppliers = supplierRepository.countInactiveSuppliers();
        double avgPurchaseVolume = purchaseOrderRepository.getAveragePurchaseVolume();

        String topSupplierVolume = "None";
        List<Object[]> topSupplierData = purchaseOrderRepository.findTopSupplierByVolume();
        if (!topSupplierData.isEmpty()) {
            topSupplierVolume = (String) topSupplierData.get(0)[0];
        }

        String supplierHighestMeds = "None";
        List<Object[]> highestMedsData = medicineRepository.findSupplierMedicineCounts();
        if (!highestMedsData.isEmpty()) {
            supplierHighestMeds = (String) highestMedsData.get(0)[0];
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

        // Recent items (capped at 10)
        List<com.medistock.backend.entity.Notification> recentNotifications = notificationRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());

        List<com.medistock.backend.dto.response.StockLogResponse> recentStockLogs = stockLogRepository.findAll().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(10)
                .map(this::mapToStockLogResponse)
                .collect(Collectors.toList());

        List<RecentPurchaseOrderDto> recentPurchaseOrders = purchaseOrderRepository.findAll().stream()
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
                // New analytics fields
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
                .notificationsToday(notificationsToday)
                .unreadNotifications(unreadNotifications)
                .readNotifications(readNotifications)
                .expiryNotifications(expiryNotifications)
                .lowStockNotifications(lowStockNotifications)
                .purchaseNotifications(purchaseNotifications)
                .emailNotificationsSent(emailNotificationsSent)
                .build();

        return ResponseEntity.ok(ApiResponse.<DashboardSummary>builder()
                .success(true)
                .message("Fetched dashboard summaries.")
                .data(summary)
                .build());
    }

    @Data
    @Builder
    public static class DashboardSummary {
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
        private List<CategoryMetric> categoryMetrics;
        private List<com.medistock.backend.entity.Notification> recentNotifications;
        private List<com.medistock.backend.dto.response.StockLogResponse> recentStockLogs;
        private List<RecentPurchaseOrderDto> recentPurchaseOrders;

        // New analytics fields
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
        private long notificationsToday;
        private long unreadNotifications;
        private long readNotifications;
        private long expiryNotifications;
        private long lowStockNotifications;
        private long purchaseNotifications;
        private long emailNotificationsSent;
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
}
