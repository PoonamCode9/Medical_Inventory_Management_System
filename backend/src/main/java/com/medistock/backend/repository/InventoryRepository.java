package com.medistock.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.medistock.backend.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.medicine.medicineId = :medicineId")
    void deleteInventoryByMedicineId(@Param("medicineId") Integer medicineId);
    List<Inventory> findByMedicine_MedicineNameContainingIgnoreCase(String keyword);
    Optional<Inventory> findByMedicine_MedicineId(Integer medicineId);

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantityAvailable <= i.minimumStock")
    long countByQuantityAvailableLessThanEqualMinimumStock();

}