package com.medistock.backend.dto;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class PurchaseOrderRequest {
      private Integer supplierId;
    private Integer medicineId;
    private Integer quantity;
    private LocalDate purchaseDate;
    private String status;
}
