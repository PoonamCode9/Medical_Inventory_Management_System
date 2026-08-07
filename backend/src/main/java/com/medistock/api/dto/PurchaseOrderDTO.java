package com.medistock.api.dto;

import com.medistock.api.models.PurchaseOrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public class PurchaseOrderDTO {

    private Long id;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime orderDate;
    private PurchaseOrderStatus status;
    private Double totalAmount;
    private List<PurchaseOrderItemDTO> items;

    // Default constructor
    public PurchaseOrderDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public PurchaseOrderStatus getStatus() { return status; }
    public void setStatus(PurchaseOrderStatus status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<PurchaseOrderItemDTO> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemDTO> items) { this.items = items; }
}
