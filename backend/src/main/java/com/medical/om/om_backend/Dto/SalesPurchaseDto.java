package com.medical.om.om_backend.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SalesPurchaseDto {
    private Long medicineId;
    private int quantity;
    private double amount;
    private String date;
    private String type;
    private String batch;
    private Long supplierId;
    private String manufacturing_date;
    private String expiration_date;
    private String newMedicineName;
    private String newMedicineDescription;
    private String newMedicineCategory;
}
