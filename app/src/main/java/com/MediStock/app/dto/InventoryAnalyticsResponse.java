package com.MediStock.app.dto;

import java.math.BigDecimal;

public class InventoryAnalyticsResponse {

    private Long totalInventoryBatches;

    private Long totalStockQuantity;

    private BigDecimal totalInventoryValue;

    private Long healthyStock;

    private Long lowStock;

    private Long expiringSoon;

    private Long expiredStock;

    public InventoryAnalyticsResponse() {
    }

    public Long getTotalInventoryBatches() {
        return totalInventoryBatches;
    }

    public void setTotalInventoryBatches(Long totalInventoryBatches) {
        this.totalInventoryBatches = totalInventoryBatches;
    }

    public Long getTotalStockQuantity() {
        return totalStockQuantity;
    }

    public void setTotalStockQuantity(Long totalStockQuantity) {
        this.totalStockQuantity = totalStockQuantity;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public Long getHealthyStock() {
        return healthyStock;
    }

    public void setHealthyStock(Long healthyStock) {
        this.healthyStock = healthyStock;
    }

    public Long getLowStock() {
        return lowStock;
    }

    public void setLowStock(Long lowStock) {
        this.lowStock = lowStock;
    }

    public Long getExpiringSoon() {
        return expiringSoon;
    }

    public void setExpiringSoon(Long expiringSoon) {
        this.expiringSoon = expiringSoon;
    }

    public Long getExpiredStock() {
        return expiredStock;
    }

    public void setExpiredStock(Long expiredStock) {
        this.expiredStock = expiredStock;
    }

}