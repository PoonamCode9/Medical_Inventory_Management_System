package com.MediStock.app.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tracking_id")
    private Long trackingId;

    @Column(name = "batch_id")
    private Long batchId;

    @Column(name = "status")
    private String status;

    @Column(name = "last_checked")
    private LocalDateTime lastChecked;

    public Long getTrackingId() {
        return trackingId;
    }
    public void setTrackingId(Long trackingId) {
        this.trackingId = trackingId;
    }
    public Long getBatchId() {
        return batchId;
    }
    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getLastChecked() {
        return lastChecked;
    }
    public void setLastChecked(LocalDateTime lastChecked) {
        this.lastChecked = lastChecked;
    }
}
