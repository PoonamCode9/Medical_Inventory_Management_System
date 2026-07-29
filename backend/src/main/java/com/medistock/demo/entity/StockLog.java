package com.medistock.demo.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;



@Entity
@Data
@Table(name="stock_logs")
public class StockLog {



    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;





    // Medicine reference

    @ManyToOne
    @JoinColumn(
            name="medicine_id",
            nullable=false
    )
    private Medicine medicine;






    // ADD / REMOVE operation

    @Column(
            nullable=false
    )
    private String operation;






    @Column(
            name="old_quantity"
    )
    private Integer oldQuantity;






    @Column(
            name="new_quantity"
    )
    private Integer newQuantity;






    @Column(
            name="quantity_changed"
    )
    private Integer quantityChanged;






    // User who performed stock operation

    @ManyToOne
    @JoinColumn(
            name="performed_by"
    )
    private User performedBy;






    @Column(
            name="created_at"
    )
    private LocalDateTime createdAt;






    @PrePersist
    public void onCreate(){

        createdAt = LocalDateTime.now();

    }



}