package com.medistock.backend.repository;

import com.medistock.backend.entity.ExpiryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Integer> {
}
