package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Suppliers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Suppliers, Long> {
    List<Suppliers> findTop5ByOrderByIdDesc();

    @Query("SELECT s FROM Suppliers s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(s.address) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Suppliers> search(@Param("q") String q);
}
