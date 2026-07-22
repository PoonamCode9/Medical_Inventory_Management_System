package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.SalesPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPurchaseRepository extends JpaRepository<SalesPurchase, Long> {
    List<SalesPurchase> findTop5ByOrderByIdDesc();
}
