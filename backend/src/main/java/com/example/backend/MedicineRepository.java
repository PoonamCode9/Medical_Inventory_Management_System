package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    Optional<Medicine> findByBatchNumber(String batchNumber);

    @Query("SELECT m.category, COUNT(m) FROM Medicine m GROUP BY m.category")
    List<Object[]> findCategoryDistribution();
}

