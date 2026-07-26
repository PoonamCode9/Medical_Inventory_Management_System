package com.medistock.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long supplierId;

    private String supplierName;

    private String medicineName;

    private Integer quantity;

    private Double totalAmount;

    private String status;

    private LocalDate orderDate;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (orderDate == null) orderDate = LocalDate.now();
        if (status == null) status = "PENDING";
    }
}