package com.medistock.backend.dto;

import com.medistock.backend.model.Inventory;
import java.time.LocalDate;

public class InventoryDTO {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String batchNumber;
    private Integer quantity;
    private LocalDate expiryDate;
    private String location;

    public InventoryDTO() {}

    public InventoryDTO(Inventory inventory) {
        this.id = inventory.getId();
        if (inventory.getMedicine() != null) {
            this.medicineId = inventory.getMedicine().getId();
            this.medicineName = inventory.getMedicine().getName();
        }
        this.batchNumber = inventory.getBatchNumber();
        this.quantity = inventory.getQuantity();
        this.expiryDate = inventory.getExpiryDate();
        this.location = inventory.getLocation();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
