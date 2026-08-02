package com.medicalinventory.backend.dto;

public class LowStockAlertDTO {
    private Long medicineId;
    private String medicineName;
    private String batchNo;
    private Integer remainingQuantity;
    private Long inventoryId;

    public LowStockAlertDTO() {
    }

    public LowStockAlertDTO(Long medicineId, String medicineName, String batchNo, Integer remainingQuantity, Long inventoryId) {
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.batchNo = batchNo;
        this.remainingQuantity = remainingQuantity;
        this.inventoryId = inventoryId;
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

    public String getBatchNo() { 
        return batchNo; 
    }
    
    public void setBatchNo(String batchNo) { 
        this.batchNo = batchNo; 
    }

    public Integer getRemainingQuantity() { 
        return remainingQuantity; 
    }
    
    public void setRemainingQuantity(Integer remainingQuantity) { 
        this.remainingQuantity = remainingQuantity; 
    }

    public Long getInventoryId() { 
        return inventoryId; 
    }
    
    public void setInventoryId(Long inventoryId) { 
        this.inventoryId = inventoryId; 
    }
}