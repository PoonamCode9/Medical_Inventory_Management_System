package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {
    private Integer inventoryId;
    private MedicineResponse medicine;
    private Integer quantity;
    private Integer minimumStock;
    private Integer maximumStock;
    private LocalDateTime lastUpdated;
}
