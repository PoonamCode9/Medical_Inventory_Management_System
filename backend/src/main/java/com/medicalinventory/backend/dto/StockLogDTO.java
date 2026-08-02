package com.medicalinventory.backend.dto;

import java.time.LocalDateTime;

public class StockLogDTO {
    private Long logId;
    private Long medicineId;
    private String medicineName;
    private String batchNo;
    private Integer quantityChanged;
    private String action;
    private LocalDateTime logDate;
    private String remarks;
    private Integer quantityBefore;
    private Integer quantityAfter;
    private String performedBy;

    public StockLogDTO() {}

    public StockLogDTO(Long logId, Long medicineId, String medicineName, String batchNo, Integer quantityChanged, String action, LocalDateTime logDate, String remarks, Integer quantityBefore, Integer quantityAfter, String performedBy) {
        this.logId = logId;
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.batchNo = batchNo;
        this.quantityChanged = quantityChanged;
        this.action = action;
        this.logDate = logDate;
        this.remarks = remarks;
        this.quantityBefore = quantityBefore;
        this.quantityAfter = quantityAfter;
        this.performedBy = performedBy;
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
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

    public Integer getQuantityChanged() {
        return quantityChanged;
    }

    public void setQuantityChanged(Integer quantityChanged) {
        this.quantityChanged = quantityChanged;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDateTime logDate) {
        this.logDate = logDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Integer getQuantityBefore() {
        return quantityBefore;
    }

    public void setQuantityBefore(Integer quantityBefore) {
        this.quantityBefore = quantityBefore;
    }

    public Integer getQuantityAfter() {
        return quantityAfter;
    }

    public void setQuantityAfter(Integer quantityAfter) {
        this.quantityAfter = quantityAfter;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    
}