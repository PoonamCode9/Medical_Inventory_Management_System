package com.medicalinventory.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SystemSettingsDTO {
    private Long id;

    @NotBlank(message = "Pharmacy name cannot be blank")
    private String pharmacyName;

    private String licenseNumber;
    private String contactEmail;
    private String contactPhone;
    private String address;

    @Min(value = 1, message = "Low stock threshold must be at least 1")
    private Integer lowStockThreshold;

    @Min(value = 1, message = "Expiry alert days must be at least 1")
    private Integer expiryAlertDays;

    @Min(value = 1, message = "Urgent expiry days must be at least 1")
    private Integer urgentExpiryDays;

    public SystemSettingsDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPharmacyName() {
        return pharmacyName;
    }

    public void setPharmacyName(String pharmacyName) {
        this.pharmacyName = pharmacyName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public Integer getExpiryAlertDays() {
        return expiryAlertDays;
    }

    public void setExpiryAlertDays(Integer expiryAlertDays) {
        this.expiryAlertDays = expiryAlertDays;
    }

    public Integer getUrgentExpiryDays() {
    return urgentExpiryDays;
}

    public void setUrgentExpiryDays(Integer urgentExpiryDays) {
        this.urgentExpiryDays = urgentExpiryDays;
    }
}