package com.medicalinventory.backend.dto;

public class TopMedicineStockDTO {
    private String medicineName;
    private Integer stock;

    public TopMedicineStockDTO(String medicineName, Integer stock) {
        this.medicineName = medicineName;
        this.stock = stock;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public Integer getStock() {
        return stock;
    }
}