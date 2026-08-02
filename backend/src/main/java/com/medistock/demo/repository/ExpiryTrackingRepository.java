package com.medistock.demo.repository;


import com.medistock.demo.entity.ExpiryTracking;
import com.medistock.demo.entity.Medicine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;



public interface ExpiryTrackingRepository 
        extends JpaRepository<ExpiryTracking, Long> {



    // Find expiry record by medicine id
    Optional<ExpiryTracking> findByMedicineId(
            Long medicineId
    );



    // Get expiry records by status
    List<ExpiryTracking> findByStatus(
            String status
    );



    // Delete expiry tracking records when medicine is deleted
    void deleteByMedicine(
            Medicine medicine
    );


}