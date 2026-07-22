package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findTop5ByOrderByIdDesc();
    Optional<Inventory> findByMedicine_IdAndBatch(Long medicineId, String batch);

    @Query("SELECT i FROM Inventory i WHERE LOWER(i.medicine_name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(i.batch) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(i.supplier) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Inventory> search(@Param("q") String q);
}
