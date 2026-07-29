package com.medistock.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierRequest {
    private String supplierName;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private Boolean status;
}
