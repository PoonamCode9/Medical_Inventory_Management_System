package com.example.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class SupplierWithMedicinesDto {

    private Integer id;
    private String name;
    private String contactNumber;
    private String email;
    private String address;

    private List<MedicineSlimDto> medicines = new ArrayList<>();

    public SupplierWithMedicinesDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<MedicineSlimDto> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<MedicineSlimDto> medicines) {
        this.medicines = medicines;
    }
}

