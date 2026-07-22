package com.medical.om.om_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "sales_purchase")
public class SalesPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String type;

    @Column(name = "medicine_name", nullable = false)
    private String medicine_name;

    @Column(nullable = true)
    private String batch;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = true)
    private Suppliers supplier;

    @Column(nullable = true)
    private LocalDate manufacturing_date;

    @Column(nullable = true)
    private LocalDate expiration_date;
}
