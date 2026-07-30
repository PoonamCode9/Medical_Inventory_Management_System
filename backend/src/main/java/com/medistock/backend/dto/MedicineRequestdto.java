package com.medistock.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicineRequestdto{

    private String medicineName;

    private String batchNumber;

    private String category;

    private Integer supplierId;

    private Integer quantity;

    private BigDecimal price;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;

}