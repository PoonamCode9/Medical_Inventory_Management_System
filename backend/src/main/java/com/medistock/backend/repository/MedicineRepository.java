package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.medistock.backend.entity.Medicine;

public interface MedicineRepository
        extends JpaRepository<Medicine, Integer> {
 List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);
  long countByQuantityLessThanEqual(Integer quantity);

    long countByQuantity(Integer quantity);

    long countByExpiryDateBetween(
            java.time.LocalDate startDate,
            java.time.LocalDate endDate);

    long countByExpiryDateBefore(
            java.time.LocalDate date);

            @Query("""
SELECT COUNT(i)
FROM Inventory i
WHERE i.quantityAvailable <= i.minimumStock
""")
Long countByQuantityAvailableLessThanEqualMinimumStock();

  List<Medicine> findByExpiryDateBefore(java.time.LocalDate date);

List<Medicine> findByExpiryDateBetween(
        java.time.LocalDate start,
        java.time.LocalDate end);
}