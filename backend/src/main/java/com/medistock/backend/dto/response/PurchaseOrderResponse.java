package com.medistock.backend.dto.response;

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
public class PurchaseOrderResponse {
    private Integer purchaseOrderId;
    private SupplierDto supplier;
    private UserDto orderedBy;
    private String orderDate;
    private BigDecimal totalAmount;
    private String status;
    private List<PurchaseOrderItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SupplierDto {
        private Integer supplierId;
        private String supplierName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Integer userId;
        private String email;
    }
}
