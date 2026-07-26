package com.medistock.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MedicineRequest {
    private String name;
    private String batchNumber;
    private String category;
    private String supplier;
    private Integer quantity;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private Double price;
}