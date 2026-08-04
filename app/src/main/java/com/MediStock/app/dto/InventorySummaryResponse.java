package com.MediStock.app.dto;

import java.math.BigDecimal;

public class InventorySummaryResponse {

    private BigDecimal totalInventoryValue;

    private Integer totalMedicines;

    private Integer totalBatches;

    private Integer totalUnits;

    private Integer lowStockCount;

    private Integer expiredCount;

    private Integer expiringSoonCount;

    private String highestValueMedicine;

    private BigDecimal highestValue;

    private String lowestStockMedicine;

    private Integer lowestStockQuantity;

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public Integer getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(Integer totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public Integer getTotalBatches() {
        return totalBatches;
    }

    public void setTotalBatches(Integer totalBatches) {
        this.totalBatches = totalBatches;
    }

    public Integer getTotalUnits() {
        return totalUnits;
    }

    public void setTotalUnits(Integer totalUnits) {
        this.totalUnits = totalUnits;
    }

    public Integer getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(Integer lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public Integer getExpiredCount() {
        return expiredCount;
    }

    public void setExpiredCount(Integer expiredCount) {
        this.expiredCount = expiredCount;
    }

    public Integer getExpiringSoonCount() {
        return expiringSoonCount;
    }

    public void setExpiringSoonCount(Integer expiringSoonCount) {
        this.expiringSoonCount = expiringSoonCount;
    }

    public String getHighestValueMedicine() {
        return highestValueMedicine;
    }

    public void setHighestValueMedicine(String highestValueMedicine) {
        this.highestValueMedicine = highestValueMedicine;
    }

    public BigDecimal getHighestValue() {
        return highestValue;
    }

    public void setHighestValue(BigDecimal highestValue) {
        this.highestValue = highestValue;
    }

    public String getLowestStockMedicine() {
        return lowestStockMedicine;
    }

    public void setLowestStockMedicine(String lowestStockMedicine) {
        this.lowestStockMedicine = lowestStockMedicine;
    }

    public Integer getLowestStockQuantity() {
        return lowestStockQuantity;
    }

    public void setLowestStockQuantity(Integer lowestStockQuantity) {
        this.lowestStockQuantity = lowestStockQuantity;
    }
}