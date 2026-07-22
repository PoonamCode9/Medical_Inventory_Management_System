package com.medical.om.om_backend.Dto;

import com.medical.om.om_backend.entity.Catagories;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicineDto {
    private String name;
    private String batch;
    private LocalDate manufacturing_date;
    private LocalDate expiration_date;
    private Catagories category;
    private String description;
}
