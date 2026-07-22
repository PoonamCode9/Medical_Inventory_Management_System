package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Suppliers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Suppliers, Long> {
    List<Suppliers> findTop5ByOrderByIdDesc();
}
