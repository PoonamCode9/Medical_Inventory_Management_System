package com.medistock.backend.dto;

import lombok.Data;

@Data
public class SupplierRequest {
    private String name;
    private String contactNumber;
    private String email;
    private String address;
    private String suppliedMedicines;
}