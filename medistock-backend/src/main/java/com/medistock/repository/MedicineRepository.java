package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);

    // Low Stock
    List<Medicine> findByQuantityLessThan(int quantity);

    // Expired Medicines
    
    List<Medicine> findByQuantity(int quantity);
    List<Medicine> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);
    List<Medicine> findByExpiryDateBefore(LocalDate date);
   List<Medicine> findByCategoryContainingIgnoreCase(String category);
   List<Medicine> findByBatchNumberContainingIgnoreCase(String batchNumber);  
   List<Medicine> findByExpiryDate(LocalDate expiryDate);  
}