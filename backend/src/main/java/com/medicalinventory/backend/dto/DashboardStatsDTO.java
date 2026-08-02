package com.medicalinventory.backend.dto;

public class DashboardStatsDTO {
    private long totalMedicines;
    private long totalSuppliers;
    private long totalUsers;
    private long lowStock;
    private long outOfStock;

    public DashboardStatsDTO() {
    }
    
    public DashboardStatsDTO(long totalMedicines, long totalSuppliers, long totalUsers, long lowStock, long outOfStock) {
        this.totalMedicines = totalMedicines;
        this.totalSuppliers = totalSuppliers;
        this.totalUsers = totalUsers;
        this.lowStock = lowStock;
        this.outOfStock = outOfStock;
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

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getLowStock() {
        return lowStock;
    }

    public void setLowStock(long lowStock) {
        this.lowStock = lowStock;
    }

    public long getOutOfStock() {
        return outOfStock;
    }

    public void setOutOfStock(long outOfStock) {
        this.outOfStock = outOfStock;
    }
    
}
