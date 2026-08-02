package com.medicalinventory.backend.dto;

import java.time.LocalDateTime;

public class RecentMedicineDTO {

    private String medicineName;
    private Integer quantity;
    private LocalDateTime lastUpdated;

    public RecentMedicineDTO(String medicineName, Integer quantity, LocalDateTime lastUpdated) {
        this.medicineName = medicineName;
        this.quantity = quantity;
        this.lastUpdated = lastUpdated;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
}
