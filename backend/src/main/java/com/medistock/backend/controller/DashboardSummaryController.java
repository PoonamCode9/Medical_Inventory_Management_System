package com.medistock.backend.controller;

import com.medistock.backend.dto.response.ApiResponse;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Category;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.PurchaseOrder;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.repository.CategoryRepository;
import com.medistock.backend.service.ExpiryService;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private final ExpiryService expiryService;
    private final com.medistock.backend.repository.NotificationRepository notificationRepository;
    private final com.medistock.backend.repository.StockLogRepository stockLogRepository;
    private final com.medistock.backend.service.NotificationService notificationService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'VIEWER')")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboardSummary(Principal principal) {
        long totalMedicines = medicineRepository.count();
        long totalSuppliers = supplierRepository.count();
        long totalUsers = userRepository.count();
        long totalPurchaseOrders = purchaseOrderRepository.count();
        long totalCategories = categoryRepository.count();

        // Dynamic Inventory Value and Low Stock computation
        BigDecimal totalVal = BigDecimal.ZERO;
        long lowStockCount = 0;
        long outOfStockCount = 0;
        long goodStockCount = 0;
        long totalInventoryQuantity = 0;

        List<Inventory> inventoryList = inventoryRepository.findAll();
        for (Inventory item : inventoryList) {
            BigDecimal price = (item.getMedicine() != null && item.getMedicine().getPurchasePrice() != null)
                    ? item.getMedicine().getPurchasePrice()
                    : BigDecimal.ZERO;
            BigDecimal itemVal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalVal = totalVal.add(itemVal);
            totalInventoryQuantity += item.getQuantity();

            int minStock = item.getMinimumStock() != null ? item.getMinimumStock() : 10;
            if (item.getQuantity() == 0) {
                outOfStockCount++;
            } else if (item.getQuantity() <= minStock) {
                lowStockCount++;
            } else {
                goodStockCount++;
            }
        }

        // Expiring Medicines count (Expired, Critical, Expiring Soon)
        java.time.LocalDate today = java.time.LocalDate.now();
        long expiredMedicines = 0;
        long expiringSoonMedicines = 0; // 31-60 days
        long criticalMedicines = 0;     // 0-30 days
        long safeMedicines = 0;          // >60 days

        List<Medicine> allMedicines = medicineRepository.findAll();
        for (Medicine med : allMedicines) {
            if (med.getExpiryDate() != null) {
                long days = java.time.temporal.ChronoUnit.DAYS.between(today, med.getExpiryDate());
                if (days < 0) {
                    expiredMedicines++;
                } else if (days <= 30) {
                    criticalMedicines++;
                } else if (days <= 60) {
                    expiringSoonMedicines++;
                } else {
                    safeMedicines++;
                }
            }
        }

        // Calculate Category distribution metrics
        List<CategoryMetric> categoryMetrics = new ArrayList<>();
        List<Category> allCategories = categoryRepository.findAll();
        for (Category cat : allCategories) {
            long count = allMedicines.stream()
                    .filter(m -> m.getCategory() != null && m.getCategory().getCategoryId().equals(cat.getCategoryId()))
                    .count();
            if (count > 0) {
                categoryMetrics.add(new CategoryMetric(cat.getCategoryName(), count));
            }
        }

        // Fetch recent notifications
        List<com.medistock.backend.entity.Notification> recentNotifications = notificationRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .collect(java.util.stream.Collectors.toList());

        // Fetch recent stock activities
        List<com.medistock.backend.dto.response.StockLogResponse> recentStockLogs = stockLogRepository.findAll().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(10)
                .map(this::mapToStockLogResponse)
                .collect(java.util.stream.Collectors.toList());

        // Calculate Purchase Order metrics
        List<PurchaseOrder> allOrders = purchaseOrderRepository.findAll();
        long pendingPurchaseOrders = allOrders.stream()
                .filter(po -> "PENDING".equalsIgnoreCase(po.getStatus()))
                .count();
        long completedPurchaseOrders = allOrders.stream()
                .filter(po -> "RECEIVED".equalsIgnoreCase(po.getStatus()) || "DELIVERED".equalsIgnoreCase(po.getStatus()))
                .count();

        // Fetch recent Purchase Orders
        List<RecentPurchaseOrderDto> recentPurchaseOrders = allOrders.stream()
                .sorted((a, b) -> b.getPurchaseOrderId().compareTo(a.getPurchaseOrderId()))
                .limit(5)
                .map(po -> RecentPurchaseOrderDto.builder()
                        .purchaseOrderId(po.getPurchaseOrderId())
                        .supplierName(po.getSupplier() != null ? po.getSupplier().getSupplierName() : "Unknown")
                        .orderDate(po.getOrderDate() != null ? po.getOrderDate().toString() : "")
                        .totalAmount(po.getTotalAmount())
                        .status(po.getStatus())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        DashboardSummary summary = DashboardSummary.builder()
                .totalMedicines(totalMedicines)
                .inventoryValue(totalVal)
                .suppliers(totalSuppliers)
                .users(totalUsers)
                .lowStock(lowStockCount)
                .outOfStock(outOfStockCount)
                .goodStock(goodStockCount)
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
