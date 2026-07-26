package com.medistock.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String batchNumber;

    private String category;

    private String supplier;

    private Integer quantity;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;

    private Double price;

    private String status;
}