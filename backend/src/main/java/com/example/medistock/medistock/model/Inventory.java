package com.example.medistock.medistock.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Column(nullable = false)
    private Integer quantity;

    private LocalDate manufacturingDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "stock_status")
    private String stockStatus = "IN_STOCK"; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
}