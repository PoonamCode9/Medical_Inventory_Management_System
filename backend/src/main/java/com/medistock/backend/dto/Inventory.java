package com.medistock.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Inventory {

    private Integer inventoryId;

    private Integer medicineId;

    private String medicineName;

    private Integer quantityAvailable;

    private Integer minimumStock;

    private LocalDateTime lastUpdated;
}