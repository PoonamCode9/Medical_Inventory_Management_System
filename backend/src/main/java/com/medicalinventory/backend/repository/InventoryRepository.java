package com.medicalinventory.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.medicalinventory.backend.dto.RecentMedicineDTO;
import com.medicalinventory.backend.dto.TopMedicineStockDTO;
import com.medicalinventory.backend.entity.Inventory;
import com.medicalinventory.backend.entity.Medicine;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    boolean existsByMedicine(Medicine medicine);

    @Query("""
    SELECT new com.medicalinventory.backend.dto.RecentMedicineDTO(
    m.medicineName,
    i.quantity,
    i.lastUpdated
    )
    FROM Inventory i
    JOIN i.medicine m
    ORDER BY i.lastUpdated DESC
    """)
    List<RecentMedicineDTO> getRecentMedicines(Pageable pageable);


    long countByQuantityEquals(int quantity);
    long countByQuantityGreaterThanAndQuantityLessThan(int min, int max);

    @Query("""
    SELECT new com.medicalinventory.backend.dto.TopMedicineStockDTO(
    m.medicineName,
    i.quantity
    )
    FROM Inventory i
    JOIN i.medicine m
    ORDER BY i.quantity DESC
    """)
    List<TopMedicineStockDTO> getTopMedicineStock(Pageable pageable);

    Optional<Inventory> findByMedicine(Medicine medicine);

}