package com.medistock.backend.dto;

import com.medistock.backend.model.Medicine;
import java.math.BigDecimal;

public class MedicineDTO {
    private Long id;
    private String name;
    private String genericName;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private Integer stockQuantity;
    private Integer minStockAlert;

    public MedicineDTO() {}

    public MedicineDTO(Medicine medicine) {
        this.id = medicine.getId();
        this.name = medicine.getName();
        this.genericName = medicine.getGenericName();
        if (medicine.getCategory() != null) {
            this.categoryId = medicine.getCategory().getId();
            this.categoryName = medicine.getCategory().getName();
        }
        if (medicine.getSupplier() != null) {
            this.supplierId = medicine.getSupplier().getId();
            this.supplierName = medicine.getSupplier().getName();
        }
        this.description = medicine.getDescription();
        this.costPrice = medicine.getCostPrice();
        this.sellingPrice = medicine.getSellingPrice();
        this.stockQuantity = medicine.getStockQuantity();
        this.minStockAlert = medicine.getMinStockAlert();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getMinStockAlert() {
        return minStockAlert;
    }

    public void setMinStockAlert(Integer minStockAlert) {
        this.minStockAlert = minStockAlert;
    }
}
