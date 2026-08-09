package com.medistock.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "low_stock_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LowStockSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "snapshot_id")
    private Integer snapshotId;

    @Column(name = "snapshot_date", nullable = false, unique = true)
    private LocalDate snapshotDate;

    @Column(name = "low_stock_count", nullable = false)
    private Integer lowStockCount;
}