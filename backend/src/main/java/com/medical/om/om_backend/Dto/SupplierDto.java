package com.medical.om.om_backend.Dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SupplierDto {
    private String name;
    private String address;
    private LocalDate joinedfrom;
    private int contact;
    private String email;
}
