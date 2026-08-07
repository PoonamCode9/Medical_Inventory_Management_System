package com.medistock.api.dto;

public class PurchaseOrderItemDTO {

    private Long id;
    private String medicineName;
    private Integer quantity;
    private Double unitPrice;

    public PurchaseOrderItemDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
}
