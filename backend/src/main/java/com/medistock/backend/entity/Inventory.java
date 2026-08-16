package com.medistock.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Integer inventoryId;

  @OneToOne
@JoinColumn(name = "medicine_id", nullable = false, unique = true)
private Medicine medicine;
    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable;

    @Column(name = "minimum_stock", nullable = false)
    private Integer minimumStock;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}