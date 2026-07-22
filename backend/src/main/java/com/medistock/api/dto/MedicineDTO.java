package com.medistock.api.dto;

import com.medistock.api.models.Medicine;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicineDTO {

    private Long id;
    private String name;
    private String batchNumber;
    private Integer quantity;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private Double price;
    private Long categoryId;
    private String categoryName;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicineDTO() {}

    public static MedicineDTO fromEntity(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setBatchNumber(medicine.getBatchNumber());
        dto.setQuantity(medicine.getQuantity());
        dto.setManufacturingDate(medicine.getManufacturingDate());
        dto.setExpiryDate(medicine.getExpiryDate());
        dto.setPrice(medicine.getPrice());
        dto.setCreatedAt(medicine.getCreatedAt());
        dto.setUpdatedAt(medicine.getUpdatedAt());

        if (medicine.getCategory() != null) {
            dto.setCategoryId(medicine.getCategory().getId());
            dto.setCategoryName(medicine.getCategory().getName());
        }

        if (medicine.getSupplier() != null) {
            dto.setSupplierId(medicine.getSupplier().getId());
            dto.setSupplierName(medicine.getSupplier().getName());
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public LocalDate getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(LocalDate manufacturingDate) { this.manufacturingDate = manufacturingDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
