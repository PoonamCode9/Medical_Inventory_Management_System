package com.medicalinventory.repository;

import com.medicalinventory.entity.ExpiryTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {

    Optional<ExpiryTracking> findByMedicineMedicineId(Long medicineId);

    @Modifying
    @Transactional
    void deleteByMedicineMedicineId(Long medicineId);
}