package com.MediStock.app.dto;

import java.math.BigDecimal;

public class AdminDashboardSummary {

    private long totalMedicines;
    private long totalSuppliers;
    private long totalInventoryUnits;
    private long totalInventoryBatches;
    private BigDecimal totalInventoryValue;
    private long lowStockMedicines;
    private long expiringMedicines;
    private long totalPurchaseOrders;
    private long totalNotifications;

    public AdminDashboardSummary() {
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

    public long getTotalInventoryUnits() {
        return totalInventoryUnits;
    }

    public void setTotalInventoryUnits(long totalInventoryUnits) {
        this.totalInventoryUnits = totalInventoryUnits;
    }

    public long getTotalInventoryBatches() {
        return totalInventoryBatches;
    }

    public void setTotalInventoryBatches(long totalInventoryBatches) {
        this.totalInventoryBatches = totalInventoryBatches;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public long getLowStockMedicines() {
        return lowStockMedicines;
    }

    public void setLowStockMedicines(long lowStockMedicines) {
        this.lowStockMedicines = lowStockMedicines;
    }

    public long getExpiringMedicines() {
        return expiringMedicines;
    }

    public void setExpiringMedicines(long expiringMedicines) {
        this.expiringMedicines = expiringMedicines;
    }

    public long getTotalPurchaseOrders() {
        return totalPurchaseOrders;
    }

    public void setTotalPurchaseOrders(long totalPurchaseOrders) {
        this.totalPurchaseOrders = totalPurchaseOrders;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

}