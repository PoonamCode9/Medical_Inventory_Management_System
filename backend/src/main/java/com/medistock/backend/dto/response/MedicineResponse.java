package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponse {
    private Integer medicineId;
    private String medicineName;
    private String genericName;
    private Integer categoryId;
    private String categoryName;
    private Integer supplierId;
    private String supplierName;
    private String supplierEmail;
    private String supplierPhone;
    private String batchNumber;
    private String manufacturer;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private BigDecimal gst;
    private Integer quantity;
    private Integer minimumStock;
    private String barcode;
    private String imageUrl;
    private String description;
    private String dosage;
    private String unit;
    private Long daysUntilExpiry;
    private String expiryStatus;
    private Boolean isLowStock;
}
