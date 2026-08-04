package com.MediStock.app.repositories;

import com.MediStock.app.entities.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findAllByOrderByBatchIdAsc();

    List<Inventory> findByMedicine_MedicineId(Long medicineId);

    List<Inventory> findByQuantityLessThanEqual(Integer quantity);

    List<Inventory> findByExpDateBefore(LocalDate date);

    List<Inventory> findByExpDateBetween(LocalDate startDate,
                                         LocalDate endDate);

    Optional<Inventory> findByBatchNumber(String batchNumber);

    List<Inventory> findByMedicine_NameContainingIgnoreCase(String name);

    List<Inventory> findByMedicine_CategoryContainingIgnoreCase(String category);

}