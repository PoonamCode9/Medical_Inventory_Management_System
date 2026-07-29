package com.medistock.backend.dto.request;

import jakarta.validation.constraints.*;
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
public class MedicineRequest {

    @NotBlank(message = "Medicine Name is required")
    @Size(max = 100, message = "Medicine Name cannot exceed 100 characters")
    private String medicineName;

    @Size(max = 100, message = "Generic Name cannot exceed 100 characters")
    private String genericName;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotNull(message = "Supplier ID is required")
    private Integer supplierId;

    @NotBlank(message = "Batch Number is required")
    @Size(max = 50, message = "Batch Number cannot exceed 50 characters")
    private String batchNumber;

    @Size(max = 100, message = "Manufacturer cannot exceed 100 characters")
    private String manufacturer;

    @NotNull(message = "Manufacturing Date is required")
    private LocalDate manufactureDate;

    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;

    @NotNull(message = "Purchase Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Purchase Price must be greater than 0")
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Selling Price must be greater than 0")
    private BigDecimal sellingPrice;

    @DecimalMin(value = "0.0", message = "GST percentage cannot be negative")
    private BigDecimal gst;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum Stock is required")
    @Min(value = 0, message = "Minimum Stock cannot be negative")
    private Integer minimumStock;

    @Size(max = 50, message = "Barcode cannot exceed 50 characters")
    private String barcode;

    private String imageUrl;

    private String description;

    private String dosage;

    private String unit;
}
