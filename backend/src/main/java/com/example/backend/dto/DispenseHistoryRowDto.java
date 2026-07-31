package com.example.backend.dto;

public class DispenseHistoryRowDto {

    private Integer dispenseId;
    private String date;
    private String pharmacistName;
    private String medicineName;
    private Integer quantityDispensed;
    private String remarks;

    public Integer getDispenseId() {
        return dispenseId;
    }

    public void setDispenseId(Integer dispenseId) {
        this.dispenseId = dispenseId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getPharmacistName() {
        return pharmacistName;
    }

    public void setPharmacistName(String pharmacistName) {
        this.pharmacistName = pharmacistName;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public Integer getQuantityDispensed() {
        return quantityDispensed;
    }

    public void setQuantityDispensed(Integer quantityDispensed) {
        this.quantityDispensed = quantityDispensed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

