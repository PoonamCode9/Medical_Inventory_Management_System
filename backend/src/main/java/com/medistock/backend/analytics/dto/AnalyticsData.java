package com.medistock.backend.analytics.dto;

import com.medistock.backend.dto.response.MedicineResponse;
import com.medistock.backend.dto.response.SupplierResponse;
import com.medistock.backend.dto.response.StockLogResponse;
import com.medistock.backend.dto.response.NotificationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsData {
    // Core Counts / Inventory Statistics
    private long totalMedicines;
    private long totalSuppliers;
    private long totalCategories;
    private long totalInventoryQuantity;
    private BigDecimal totalInventoryValue;
    private long lowStockMedicines;
    private long outOfStockMedicines;
    private long expiringSoonMedicines;
    private long expiredMedicines;
    
    // Purchase Analytics
    private long purchaseOrdersPending;
    private long purchaseOrdersApproved;
    private long purchaseOrdersDelivered;
    private long purchaseOrdersCancelled;
    private long totalPurchaseOrders;
    private BigDecimal totalPurchases;
    
    // Stock Movement and Growth
    private double inventoryGrowthPercentage;
    private double averageMedicinePrice;
    
    // Extreme Stocks
    private MedicineResponse highestStockMedicine;
    private MedicineResponse lowestStockMedicine;
    
    // Supplier Analytics
    private SupplierResponse supplierHighestMedicines;
    private SupplierResponse supplierHighestPurchases;
    
    // Notification Analytics
    private long unreadNotifications;
    private long totalNotifications;
    private long notificationsToday;
    private long notificationsThisWeek;
    
    // Stock Movement Counts
    private long todayStockIn;
    private long todayStockOut;
    private long weeklyStockMovement;
    private long monthlyStockMovement;
    
    // Recent lists
    private List<StockLogResponse> recentStockTransactions;
    private List<NotificationResponse> recentNotifications;
    
    // Chart Metrics
    private List<CategoryMetric> inventoryByCategory;
    private List<StatusMetric> purchaseOrdersByStatus;
    private List<MonthlyMovementMetric> monthlyStockMovementChart;
    private List<ExpiryStatusMetric> expiryStatus;
    private List<SupplierContributionMetric> supplierContribution;
    private List<WeeklyTrendMetric> weeklyInventoryTrend;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CategoryMetric {
        private String name;
        private long count;       // count of medicines
        private long quantity;    // total quantity of medicines
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class StatusMetric {
        private String name;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MonthlyMovementMetric {
        private String month;
        private long stockIn;
        private long stockOut;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ExpiryStatusMetric {
        private String name;
        private long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SupplierContributionMetric {
        private String name;
        private long value;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WeeklyTrendMetric {
        private String date;
        private long quantity;
    }
}
