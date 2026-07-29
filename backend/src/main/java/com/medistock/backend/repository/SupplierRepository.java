package com.medistock.backend.repository;

import com.medistock.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Optional<Supplier> findByEmail(String email);
    Optional<Supplier> findByPhone(String phone);
    Optional<Supplier> findBySupplierName(String supplierName);
}
