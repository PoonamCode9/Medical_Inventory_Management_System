package com.example.medistock.medistock.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
@Data
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "po_number", nullable = false)
    private String poNumber;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "order_date")
    private LocalDate orderDate = LocalDate.now();

    @Column(name = "item_count")
    private Integer itemCount;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status")
    private String status = "PENDING"; // PENDING, APPROVED, FULFILLED, CANCELLED
}