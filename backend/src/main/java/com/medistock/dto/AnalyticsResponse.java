package com.medistock.dto;

public class AnalyticsResponse {

    private long totalMedicines;
    private long totalSuppliers;
    private long totalInventory;
    private long lowStockMedicines;
    private long expiredMedicines;
    private long expiringSoonMedicines;

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

    public long getLowStockMedicines() {
        return lowStockMedicines;
    }

    public void setLowStockMedicines(long lowStockMedicines) {
        this.lowStockMedicines = lowStockMedicines;
    }

    public long getExpiredMedicines() {
        return expiredMedicines;
    }

    public void setExpiredMedicines(long expiredMedicines) {
        this.expiredMedicines = expiredMedicines;
    }

    public long getExpiringSoonMedicines() {
        return expiringSoonMedicines;
    }

    public void setExpiringSoonMedicines(long expiringSoonMedicines) {
        this.expiringSoonMedicines = expiringSoonMedicines;
    }
}