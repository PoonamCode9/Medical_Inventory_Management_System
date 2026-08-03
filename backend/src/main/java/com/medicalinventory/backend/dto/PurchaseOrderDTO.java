package com.medicalinventory.backend.dto;

public class PurchaseOrderDTO {
    private Integer receivedQuantity;
    private Integer damagedQuantity;
    private String remarks;

    public PurchaseOrderDTO() {}

    public Integer getReceivedQuantity() { 
        return receivedQuantity; 
    }
    public void setReceivedQuantity(Integer receivedQuantity) { 
        this.receivedQuantity = receivedQuantity; 
    }

    public Integer getDamagedQuantity() { 
        return damagedQuantity; 
    }
    public void setDamagedQuantity(Integer damagedQuantity) { 
        this.damagedQuantity = damagedQuantity; 
    }

    public String getRemarks() { 
        return remarks; 
    }
    public void setRemarks(String remarks) { 
        this.remarks = remarks; 
    }
}