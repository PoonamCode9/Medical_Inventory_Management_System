package com.medistock.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="expiry_tracking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="expiry_id")
    private Integer expiryId;

    @OneToOne
    @JoinColumn(name="medicine_id")
    private Medicine medicine;

    @Column(name="expiry_date")
    private LocalDate expiryDate;

    @Column(nullable=false)
    private String status;
}