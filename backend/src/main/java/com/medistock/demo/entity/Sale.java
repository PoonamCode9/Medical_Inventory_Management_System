package com.medistock.demo.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Data
@Table(name="sales")
public class Sale {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    // Medicine relation
    @ManyToOne
    @JoinColumn(name="medicine_id")
    private Medicine medicine;



    private Integer quantity;



    @Column(name="total_amount")
    private Double totalAmount;



    // User who sold medicine
    @ManyToOne
    @JoinColumn(name="sold_by")
    private User soldBy;



    @Column(name="sale_date")
    private LocalDateTime saleDate =
            LocalDateTime.now();


}