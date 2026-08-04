package com.MediStock.app.dto;

public class ResolveNotificationRequest {

    private Long userId;

    private String remarks;

    public ResolveNotificationRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

}