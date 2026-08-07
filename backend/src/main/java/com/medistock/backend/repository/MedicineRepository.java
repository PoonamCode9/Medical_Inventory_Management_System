package com.medistock.backend.repository;

import com.medistock.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    Optional<Medicine> findByBatchNumber(String batchNumber);
    Optional<Medicine> findByMedicineNameIgnoreCase(String medicineName);
    Optional<Medicine> findByBatchNumberIgnoreCase(String batchNumber);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiryDate < :today")
    long countExpired(@Param("today") LocalDate today);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiryDate >= :start AND m.expiryDate <= :end")
    long countExpiringBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiryDate > :afterDate OR m.expiryDate IS NULL")
    long countSafe(@Param("afterDate") LocalDate afterDate);

    @Query("SELECT m.category.categoryName, COUNT(m) FROM Medicine m WHERE m.category IS NOT NULL GROUP BY m.category.categoryName")
    List<Object[]> findCategoryMetrics();

    @Query("SELECT m.supplier.supplierName, COUNT(m) FROM Medicine m WHERE m.supplier IS NOT NULL GROUP BY m.supplier.supplierName ORDER BY COUNT(m) DESC")
    List<Object[]> findSupplierMedicineCounts();
}
