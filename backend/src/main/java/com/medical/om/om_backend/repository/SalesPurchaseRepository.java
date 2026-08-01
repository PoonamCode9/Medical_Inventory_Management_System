package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.SalesPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPurchaseRepository extends JpaRepository<SalesPurchase, Long> {
    List<SalesPurchase> findTop5ByOrderByIdDesc();

    @Query("SELECT sp FROM SalesPurchase sp WHERE LOWER(sp.medicine_name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(COALESCE(sp.batch, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(sp.type) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<SalesPurchase> search(@Param("q") String q);

    @Modifying
    @Query("DELETE FROM SalesPurchase sp WHERE sp.medicine.id = :medicineId")
    void deleteByMedicineId(@Param("medicineId") Long medicineId);
}
