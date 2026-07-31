package com.medistock.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String expiryDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    public ExpiryTracking() {
    }

    public Long getId() {
        return id;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }
}