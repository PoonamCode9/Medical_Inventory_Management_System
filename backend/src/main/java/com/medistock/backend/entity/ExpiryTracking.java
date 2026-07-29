package com.medistock.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ExpiryTracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expiry_id")
    private Integer expiryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "notification_sent")
    private Boolean notificationSent = false;
}
