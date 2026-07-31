package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DispenseItemRepository extends JpaRepository<DispenseItem, Integer> {
    List<DispenseItem> findByMedicineId(Integer medicineId);

    @Query(value = "SELECT m.name, SUM(di.quantity) AS total_qty " +
           "FROM dispense_items di JOIN medicines m ON m.id = di.medicine_id " +
           "GROUP BY m.name " +
           "ORDER BY total_qty DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findTopSellingMedicines();
}


