package com.medicalinventory.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicalinventory.backend.entity.ExpiryTracking;
import com.medicalinventory.backend.entity.Medicine;

public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {
    Optional<ExpiryTracking> findByMedicine(Medicine medicine);

    List<ExpiryTracking> findAllByOrderByStatusAsc();
}
