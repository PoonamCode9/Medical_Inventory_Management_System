package com.medistock.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderItemResponse {
    private Integer itemId;
    private Integer medicineId;
    private Integer quantity;
    private BigDecimal unitPrice;
}
