package com.medicalinventory.backend.dto;

import java.time.LocalDate;

public class ExpiryAlertDTO {
    private Long medicineId;
    private String medicineName;
    private String batchNo;
    private LocalDate expiryDate;
    private String status;
    private String remarks;
    private Long daysLeft;
    private Long inventoryId;

    public ExpiryAlertDTO() {
    }
    
    public ExpiryAlertDTO(Long medicineId, String medicineName, String batchNo, LocalDate expiryDate, String status, String remarks, Long daysLeft, Long inventoryId) {
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.batchNo = batchNo;
        this.expiryDate = expiryDate;
        this.status = status;
        this.remarks = remarks;
        this.daysLeft = daysLeft;
        this.inventoryId = inventoryId;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
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

    public Long getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(Long daysLeft) {
        this.daysLeft = daysLeft;
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    
}
