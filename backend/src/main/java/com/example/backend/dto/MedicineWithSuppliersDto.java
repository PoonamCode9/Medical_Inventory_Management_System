package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MedicineWithSuppliersDto {

    private Integer id;
    private String name;
    private String batchNumber;
    private String category;
    private Integer quantity;
    private LocalDate expiryDate;
    private BigDecimal price;

    private List<SupplierSlimDto> suppliers = new ArrayList<>();

    public MedicineWithSuppliersDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<SupplierSlimDto> getSuppliers() {
        return suppliers;
    }

    public void setSuppliers(List<SupplierSlimDto> suppliers) {
        this.suppliers = suppliers;
    }
}

