package com.medistock.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierRequest{

    private String supplierName;
    private String contactNumber;
    private String email;
    private String address;

}