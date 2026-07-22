package com.medical.om.om_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "Inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "medicine_id",nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private String batch;

    @Column(name = "medicine_name", nullable = false)
    private String medicine_name;

    @Column(nullable = false)
    private int available_qty;

    @Column(nullable = false)
    private String supplier;

    @Column(nullable = true)
    private LocalDate manufacturing_date;

    @Column(nullable = true)
    private LocalDate expiration_date;

}
