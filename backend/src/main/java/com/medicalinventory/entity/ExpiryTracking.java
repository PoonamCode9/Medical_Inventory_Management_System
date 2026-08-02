package com.medicalinventory.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expiry_id")
    private Long expiryId;

    @OneToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 30)
    private String status;

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

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}