package com.medistock.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpiryDTO {

    private Integer medicineId;

    private String medicineName;

    private String batchNumber;

    private String category;

    private Integer quantity;

    private LocalDate expiryDate;

    private Long daysRemaining;

    private String status;
}