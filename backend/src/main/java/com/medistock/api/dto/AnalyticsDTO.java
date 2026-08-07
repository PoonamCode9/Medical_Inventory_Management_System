package com.medistock.api.dto;

import java.util.List;

public class AnalyticsDTO {

    private long totalMedicines;
    private long lowStockCount;
    private long expiringCount;
    private long expiredCount;
    private long totalStockIn;
    private long totalStockOut;
    private double totalInventoryValue;
    
    // Purchase Order Stats
    private long totalPurchaseOrders;
    private long pendingOrders;
    private long receivedOrders;
    private double totalPurchaseSpend;
    
    private List<CategoryStat>   categoryBreakdown;
    private List<SupplierStat>   supplierBreakdown;
    private List<LowStockItem>   topLowStockItems;
    private List<DailyMovement>  dailyMovements;

    // ── Nested: Category Stat ─────────────────────────────────────────────────────

    public static class CategoryStat {
        private String categoryName;
        private long count;

        public CategoryStat(String categoryName, long count) {
            this.categoryName = categoryName;
            this.count        = count;
        }

        public String getCategoryName() { return categoryName; }
        public long getCount()          { return count; }
    }

    // ── Nested: Supplier Stat ─────────────────────────────────────────────────────

    public static class SupplierStat {
        private String supplierName;
        private long count;

        public SupplierStat(String supplierName, long count) {
            this.supplierName = supplierName;
            this.count        = count;
        }

        public String getSupplierName() { return supplierName; }
        public long getCount()          { return count; }
    }

    // ── Nested: Low-stock item ────────────────────────────────────────────────────

    public static class LowStockItem {
        private Long   id;
        private String name;
        private int    quantity;
        private String categoryName;

        public LowStockItem(Long id, String name, int quantity, String categoryName) {
            this.id           = id;
            this.name         = name;
            this.quantity     = quantity;
            this.categoryName = categoryName;
        }

        public Long   getId()           { return id; }
        public String getName()         { return name; }
        public int    getQuantity()     { return quantity; }
        public String getCategoryName() { return categoryName; }
    }

    // ── Nested: Daily Movement ───────────────────────────────────────────────────

    public static class DailyMovement {
        private String date;   // ISO date string e.g. "2026-08-01"
        private long   stockIn;
        private long   stockOut;

        public DailyMovement(String date, long stockIn, long stockOut) {
            this.date     = date;
            this.stockIn  = stockIn;
            this.stockOut = stockOut;
        }

        public String getDate()     { return date; }
        public long   getStockIn()  { return stockIn; }
        public long   getStockOut() { return stockOut; }
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────────

    public long getTotalMedicines()              { return totalMedicines; }
    public void setTotalMedicines(long v)        { this.totalMedicines = v; }

    public long getLowStockCount()               { return lowStockCount; }
    public void setLowStockCount(long v)         { this.lowStockCount = v; }

    public long getExpiringCount()               { return expiringCount; }
    public void setExpiringCount(long v)         { this.expiringCount = v; }

    public long getExpiredCount()                { return expiredCount; }
    public void setExpiredCount(long v)          { this.expiredCount = v; }

    public long getTotalStockIn()                { return totalStockIn; }
    public void setTotalStockIn(long v)          { this.totalStockIn = v; }

    public long getTotalStockOut()               { return totalStockOut; }
    public void setTotalStockOut(long v)         { this.totalStockOut = v; }

    public double getTotalInventoryValue()              { return totalInventoryValue; }
    public void   setTotalInventoryValue(double v)      { this.totalInventoryValue = v; }

    public long getTotalPurchaseOrders()                { return totalPurchaseOrders; }
    public void setTotalPurchaseOrders(long v)          { this.totalPurchaseOrders = v; }

    public long getPendingOrders()                      { return pendingOrders; }
    public void setPendingOrders(long v)                { this.pendingOrders = v; }

    public long getReceivedOrders()                     { return receivedOrders; }
    public void setReceivedOrders(long v)               { this.receivedOrders = v; }

    public double getTotalPurchaseSpend()               { return totalPurchaseSpend; }
    public void setTotalPurchaseSpend(double v)         { this.totalPurchaseSpend = v; }

    public List<CategoryStat> getCategoryBreakdown()        { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryStat> v)  { this.categoryBreakdown = v; }

    public List<SupplierStat> getSupplierBreakdown()        { return supplierBreakdown; }
    public void setSupplierBreakdown(List<SupplierStat> v)  { this.supplierBreakdown = v; }

    public List<LowStockItem> getTopLowStockItems()         { return topLowStockItems; }
    public void setTopLowStockItems(List<LowStockItem> v)   { this.topLowStockItems = v; }

    public List<DailyMovement> getDailyMovements()          { return dailyMovements; }
    public void setDailyMovements(List<DailyMovement> v)    { this.dailyMovements = v; }
}
