package com.medistock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;

    private String category;

    private String batchNumber;

    private int quantity;

    private double price;

    private LocalDate manufacturingDate;

    private LocalDate expiryDate;
}