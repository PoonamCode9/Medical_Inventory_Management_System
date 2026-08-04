package com.medistock.dto;

public class AnalyticsResponse {

    private long totalMedicines;
    private long totalSuppliers;
    private long totalInventory;
    private long lowStock;
    private long expiringSoon;
    private long expired;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(long totalMedicines,
                             long totalSuppliers,
                             long totalInventory,
                             long lowStock,
                             long expiringSoon,
                             long expired) {
        this.totalMedicines = totalMedicines;
        this.totalSuppliers = totalSuppliers;
        this.totalInventory = totalInventory;
        this.lowStock = lowStock;
        this.expiringSoon = expiringSoon;
        this.expired = expired;
    }

    public long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public long getTotalInventory() {
        return totalInventory;
    }

    public void setTotalInventory(long totalInventory) {
        this.totalInventory = totalInventory;
    }

    public long getLowStock() {
        return lowStock;
    }

    public void setLowStock(long lowStock) {
        this.lowStock = lowStock;
    }

    public long getExpiringSoon() {
        return expiringSoon;
    }

    public void setExpiringSoon(long expiringSoon) {
        this.expiringSoon = expiringSoon;
    }

    public long getExpired() {
        return expired;
    }

    public void setExpired(long expired) {
        this.expired = expired;
    }
}