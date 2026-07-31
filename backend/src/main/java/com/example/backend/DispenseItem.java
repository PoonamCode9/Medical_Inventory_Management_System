package com.example.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "dispense_items")
public class DispenseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dispense_id", nullable = false)
    private Dispense dispense;

    @ManyToOne(optional = false)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    public DispenseItem() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Dispense getDispense() {
        return dispense;
    }

    public void setDispense(Dispense dispense) {
        this.dispense = dispense;
    }

    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

