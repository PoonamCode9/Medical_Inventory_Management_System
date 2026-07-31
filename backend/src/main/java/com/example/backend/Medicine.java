package com.example.backend;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "batch_number", nullable = false, unique = true, length = 50)
    private String batchNumber;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    // DB: price DECIMAL(10,2)
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public Medicine() {
    }

    public Medicine(String name, String batchNumber, String category, Integer quantity, LocalDate expiryDate, BigDecimal price) {
        this.name = name;
        this.batchNumber = batchNumber;
        this.category = category;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.price = price;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

