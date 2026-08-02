package com.medicalinventory.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.medicalinventory.backend.entity.Medicine;
import java.util.List;
import java.util.Optional;


public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByBatchNo(String batchNo);

    List<Medicine> findByCategory(String category);

    List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);

    @Query("SELECT DISTINCT m.category FROM Medicine m")
    List<String> findDistinctCategories();

    @Query("SELECT m.category, COUNT(m) FROM Medicine m GROUP BY m.category")
    List<Object[]> getCategoryWiseCount();
}
