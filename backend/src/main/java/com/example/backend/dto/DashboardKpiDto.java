package com.example.backend.dto;

import java.math.BigDecimal;

public class DashboardKpiDto {

    private long totalMedicines;
    private long currentStockUnits;
    private BigDecimal inventoryValue;
    private long lowStockItems;
    private long expiringSoon;
    private long monthlyPurchases;

    public long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public long getCurrentStockUnits() {
        return currentStockUnits;
    }

    public void setCurrentStockUnits(long currentStockUnits) {
        this.currentStockUnits = currentStockUnits;
    }

    public BigDecimal getInventoryValue() {
        return inventoryValue;
    }

    public void setInventoryValue(BigDecimal inventoryValue) {
        this.inventoryValue = inventoryValue;
    }

    public long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public long getExpiringSoon() {
        return expiringSoon;
    }

    public void setExpiringSoon(long expiringSoon) {
        this.expiringSoon = expiringSoon;
    }

    public long getMonthlyPurchases() {
        return monthlyPurchases;
    }

    public void setMonthlyPurchases(long monthlyPurchases) {
        this.monthlyPurchases = monthlyPurchases;
    }
}

