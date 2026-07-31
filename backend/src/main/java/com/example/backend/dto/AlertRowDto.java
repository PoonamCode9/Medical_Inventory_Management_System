package com.example.backend.dto;

import java.time.LocalDate;

public class AlertRowDto {

    private Integer medicineId;
    private String medicineName;
    private String batchNumber;
    private String category;

    // Use for expire alerts
    private LocalDate expiryDate;
    private Integer daysToExpiry;

    // Use for low-stock alerts
    private Integer quantity;

    public AlertRowDto() {
    }

    public Integer getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Integer medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getDaysToExpiry() {
        return daysToExpiry;
    }

    public void setDaysToExpiry(Integer daysToExpiry) {
        this.daysToExpiry = daysToExpiry;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

