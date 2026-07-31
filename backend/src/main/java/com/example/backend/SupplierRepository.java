package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Optional<Supplier> findByEmail(String email);
}


