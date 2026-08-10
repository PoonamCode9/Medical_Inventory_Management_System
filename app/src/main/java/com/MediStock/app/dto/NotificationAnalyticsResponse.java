package com.MediStock.app.dto;

public class NotificationAnalyticsResponse {

    private Long totalNotifications;

    private Long activeNotifications;

    private Long reviewedNotifications;

    private Long resolvedNotifications;

    public NotificationAnalyticsResponse() {
    }

    public Long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(Long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public Long getActiveNotifications() {
        return activeNotifications;
    }

    public void setActiveNotifications(Long activeNotifications) {
        this.activeNotifications = activeNotifications;
    }

    public Long getReviewedNotifications() {
        return reviewedNotifications;
    }

    public void setReviewedNotifications(Long reviewedNotifications) {
        this.reviewedNotifications = reviewedNotifications;
    }

    public Long getResolvedNotifications() {
        return resolvedNotifications;
    }

    public void setResolvedNotifications(Long resolvedNotifications) {
        this.resolvedNotifications = resolvedNotifications;
    }

}