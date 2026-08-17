package com.example.medistock.medistock.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "stock_logs")
@Data
public class StockLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "movement_type", nullable = false)
    private String movementType; // ADDED, SOLD, EXPIRED, OUT_OF_STOCK

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged;

    @Column(name = "log_date")
    private LocalDate logDate = LocalDate.now();
}