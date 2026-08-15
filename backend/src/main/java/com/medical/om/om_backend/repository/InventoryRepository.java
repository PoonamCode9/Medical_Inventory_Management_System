package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findTop5ByOrderByIdDesc();
    Optional<Inventory> findByMedicine_IdAndBatch(Long medicineId, String batch);

    @Query("SELECT i FROM Inventory i WHERE LOWER(i.medicine_name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(i.batch) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(i.supplier) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Inventory> search(@Param("q") String q);

    @Query("SELECT i FROM Inventory i WHERE i.expiration_date IS NOT NULL AND i.available_qty > 0 ORDER BY i.expiration_date ASC")
    List<Inventory> findAllWithExpiration();

    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.expiration_date < :date")
    void deleteExpiredBefore(@Param("date") LocalDate date);

    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.medicine.id = :medicineId")
    void deleteByMedicineId(@Param("medicineId") Long medicineId);

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.expiration_date IS NULL OR i.expiration_date >= CURRENT_DATE")
    long countActive();

    @Query("SELECT COALESCE(SUM(i.available_qty), 0) FROM Inventory i WHERE i.expiration_date IS NULL OR i.expiration_date >= CURRENT_DATE")
    long sumActiveStock();
}
