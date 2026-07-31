package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class PurchaseOrderDetailsDto {

    private String poNumber;
    private Integer supplierId;
    private String supplierName;
    private LocalDate requiredDate;

    private List<PurchaseOrderItemDto> items;

    private String overallStatus;
    private String adminStatus;
    private String supplierStatus;
    private String receivingStatus;

    private List<PurchaseOrderStatusHistoryDto> statusHistory;

    private String createdByName;
    private String requiredDateDisplay;

    public String getPoNumber() {
        return poNumber;
    }

    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(LocalDate requiredDate) {
        this.requiredDate = requiredDate;
    }

    public List<PurchaseOrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<PurchaseOrderItemDto> items) {
        this.items = items;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public String getAdminStatus() {
        return adminStatus;
    }

    public void setAdminStatus(String adminStatus) {
        this.adminStatus = adminStatus;
    }

    public String getSupplierStatus() {
        return supplierStatus;
    }

    public void setSupplierStatus(String supplierStatus) {
        this.supplierStatus = supplierStatus;
    }

    public String getReceivingStatus() {
        return receivingStatus;
    }

    public void setReceivingStatus(String receivingStatus) {
        this.receivingStatus = receivingStatus;
    }

    public List<PurchaseOrderStatusHistoryDto> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<PurchaseOrderStatusHistoryDto> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getRequiredDateDisplay() {
        return requiredDateDisplay;
    }

    public void setRequiredDateDisplay(String requiredDateDisplay) {
        this.requiredDateDisplay = requiredDateDisplay;
    }
}

