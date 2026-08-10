package com.MediStock.app.dto;

public class PurchaseAnalyticsResponse {

    private Long totalPurchaseOrders;

    private Long pendingOrders;

    private Long approvedOrders;

    private Long deliveredOrders;

    private Long cancelledOrders;

    public PurchaseAnalyticsResponse() {
    }

    public Long getTotalPurchaseOrders() {
        return totalPurchaseOrders;
    }

    public void setTotalPurchaseOrders(Long totalPurchaseOrders) {
        this.totalPurchaseOrders = totalPurchaseOrders;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getApprovedOrders() {
        return approvedOrders;
    }

    public void setApprovedOrders(Long approvedOrders) {
        this.approvedOrders = approvedOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

}