package com.medistock.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockLogDTO {

    private Integer logId;

    private Integer inventoryId;

    private String medicineName;

    private String movementType;

    private Integer quantity;

    private Integer referenceId;

    private LocalDateTime transactionDate;

}