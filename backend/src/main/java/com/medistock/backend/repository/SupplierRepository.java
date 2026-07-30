package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
      List<Supplier> findBySupplierNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactNumberContaining(
            String supplierName,
            String email,
            String contactNumber
    );
}