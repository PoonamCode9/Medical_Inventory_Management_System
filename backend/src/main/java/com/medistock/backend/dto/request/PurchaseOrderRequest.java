package com.medistock.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderRequest {
    private Integer supplierId;
    private Integer orderedBy;
    private String orderDate;
    private BigDecimal totalAmount;
    private String status;
    private List<PurchaseOrderItemRequest> items;
}
