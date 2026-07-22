package com.medical.om.om_backend.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryDto {
    private Long medicineId;
    private String batch;
    private int available_qty;
    private String supplier;
    private String manufacturing_date;
    private String expiration_date;
}
