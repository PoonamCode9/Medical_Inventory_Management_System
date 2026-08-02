package com.medicalinventory.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicalinventory.backend.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByEmail(String email);

    Optional<Supplier> findByEmail(String email);
}
