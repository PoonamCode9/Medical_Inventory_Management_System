package com.example.medistock.medistock.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sales")
@Data
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", nullable = false, unique = true)
    private String billNumber;

    @Column(name = "customer_name")
    private String customerName = "Walk-in Customer";

    @Column(name = "payment_method")
    private String paymentMethod = "CASH";

    private Double subtotal;
    private Double gstAmount;
    private Double grandTotal;

    @Column(name = "sale_date")
    private LocalDate saleDate = LocalDate.now();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private List<SaleItem> items;
}