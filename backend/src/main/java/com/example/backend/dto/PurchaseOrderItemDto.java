package com.example.backend.dto;

import java.math.BigDecimal;

public class PurchaseOrderItemDto {
    private Integer medicineId;
    private String medicineName;
    private Integer quantityOrdered;
    private BigDecimal unitPrice;
    private BigDecimal expectedTotal;

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

    public Integer getQuantityOrdered() {
        return quantityOrdered;
    }

    public void setQuantityOrdered(Integer quantityOrdered) {
        this.quantityOrdered = quantityOrdered;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getExpectedTotal() {
        return expectedTotal;
    }

    public void setExpectedTotal(BigDecimal expectedTotal) {
        this.expectedTotal = expectedTotal;
    }
}

