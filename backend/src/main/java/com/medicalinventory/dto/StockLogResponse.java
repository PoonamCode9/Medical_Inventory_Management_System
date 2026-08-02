package com.medicalinventory.dto;

import java.time.LocalDateTime;

public class StockLogResponse {

    private Long logId;
    private String medicineName;
    private String manufacturer;
    private String expiryDate;
    private String supplierName;
    private Integer oldQuantity;
    private String action;
    private Integer quantity;
    private Integer newQuantity;
    private String updatedBy;
    private String role;
    private LocalDateTime actionDate;
    private String remarks;

    public StockLogResponse(Long logId,
            String medicineName,
            String manufacturer,
            String expiryDate,
            String supplierName,
            Integer oldQuantity,
            String action,
            Integer quantity,
            Integer newQuantity,
            String updatedBy,
            String role,
            LocalDateTime actionDate,
            String remarks) {

        this.logId = logId;
        this.medicineName = medicineName;
        this.manufacturer = manufacturer;
        this.expiryDate = expiryDate;
        this.supplierName = supplierName;
        this.oldQuantity = oldQuantity;
        this.action = action;
        this.quantity = quantity;
        this.newQuantity = newQuantity;
        this.updatedBy = updatedBy;
        this.role = role;
        this.actionDate = actionDate;
        this.remarks = remarks;
    }

    public Long getLogId() {
        return logId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public Integer getOldQuantity() {
        return oldQuantity;
    }

    public String getAction() {
        return action;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getNewQuantity() {
        return newQuantity;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getActionDate() {
        return actionDate;
    }

    public String getRemarks() {
        return remarks;
    }
}