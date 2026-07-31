package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.ExpiryTracking;

public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {

}