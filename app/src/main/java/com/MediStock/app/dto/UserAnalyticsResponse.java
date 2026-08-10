package com.MediStock.app.dto;

public class UserAnalyticsResponse {

    private Long totalUsers;

    private Long adminUsers;

    private Long pharmacistUsers;

    private Long staffUsers;

    public UserAnalyticsResponse() {
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getAdminUsers() {
        return adminUsers;
    }

    public void setAdminUsers(Long adminUsers) {
        this.adminUsers = adminUsers;
    }

    public Long getPharmacistUsers() {
        return pharmacistUsers;
    }

    public void setPharmacistUsers(Long pharmacistUsers) {
        this.pharmacistUsers = pharmacistUsers;
    }

    public Long getStaffUsers() {
        return staffUsers;
    }

    public void setStaffUsers(Long staffUsers) {
        this.staffUsers = staffUsers;
    }

}