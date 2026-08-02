package com.medicalinventory.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expiryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false, unique = true)
    private Medicine medicine;

    @Column(nullable = false)
    private String status = "Active";

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public ExpiryTracking() {
    }

    public Long getExpiryId() {
        return expiryId;
    }

    public void setExpiryId(Long expiryId) {
        this.expiryId = expiryId;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    
}
