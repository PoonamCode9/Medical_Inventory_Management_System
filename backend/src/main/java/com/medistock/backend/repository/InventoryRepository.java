package com.medistock.backend.repository;

import com.medistock.backend.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByMedicineId(Long medicineId);
    Optional<Inventory> findByMedicineIdAndBatchNumber(Long medicineId, String batchNumber);

    @Query("SELECT i FROM Inventory i WHERE i.expiryDate <= :date AND i.quantity > 0")
    List<Inventory> findExpiringSoon(LocalDate date);

    @Query("SELECT COALESCE(SUM(i.quantity * i.medicine.costPrice), 0) FROM Inventory i")
    double calculateTotalInventoryValue();
}
