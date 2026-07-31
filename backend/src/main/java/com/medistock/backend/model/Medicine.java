package com.medistock.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(name = "batch_number")
    private String batchNumber;

    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private int quantity;

    @Column(name = "reorder_level")
    private int reorderLevel;

    @NotNull
    @Column(name = "mfg_date")
    private LocalDate mfgDate;

    @NotNull
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private double price;

    private String unit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(int reorderLevel) { this.reorderLevel = reorderLevel; }

    public LocalDate getMfgDate() { return mfgDate; }
    public void setMfgDate(LocalDate mfgDate) { this.mfgDate = mfgDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    /** Days remaining until expiry. Negative means already expired. */
    @Transient
    public long getDaysToExpiry() {
        return ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }
}
