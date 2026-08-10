package com.MediStock.app.dto;

public class DashboardSummaryResponse {

    private Long totalMedicines;

    private Long totalSuppliers;

    private Long totalInventoryBatches;

    private Long totalPurchaseOrders;

    private Long totalUsers;

    private Long totalNotifications;

    public DashboardSummaryResponse() {
    }

    public Long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(Long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public Long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(Long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public Long getTotalInventoryBatches() {
        return totalInventoryBatches;
    }

    public void setTotalInventoryBatches(Long totalInventoryBatches) {
        this.totalInventoryBatches = totalInventoryBatches;
    }

    public Long getTotalPurchaseOrders() {
        return totalPurchaseOrders;
    }

    public void setTotalPurchaseOrders(Long totalPurchaseOrders) {
        this.totalPurchaseOrders = totalPurchaseOrders;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(Long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

}