package com.MediStock.app.repositories;

import com.MediStock.app.entities.ExpiryTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {

    List<ExpiryTracking> findByStatus(String status);

}
