package com.medistock.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.ExpiryTracking;


public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking,Integer>{
Long countByStatus(String status);
}