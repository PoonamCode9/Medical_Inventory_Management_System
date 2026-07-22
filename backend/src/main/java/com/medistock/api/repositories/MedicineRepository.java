package com.medistock.api.repositories;

import com.medistock.api.models.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    Page<Medicine> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Medicine> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT m FROM Medicine m WHERE " +
           "(:name = '' OR LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId = -1L OR m.category.id = :categoryId)")
    Page<Medicine> findByFilters(@Param("name") String name,
                                  @Param("categoryId") Long categoryId,
                                  Pageable pageable);

    List<Medicine> findByExpiryDateBefore(LocalDate date);

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate BETWEEN :today AND :endDate ORDER BY m.expiryDate ASC")
    List<Medicine> findExpiringBetween(@Param("today") LocalDate today, @Param("endDate") LocalDate endDate);

    List<Medicine> findByQuantityLessThanEqual(int threshold);

    long countByQuantityLessThanEqual(int threshold);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiryDate BETWEEN :today AND :endDate")
    long countExpiringBetween(@Param("today") LocalDate today, @Param("endDate") LocalDate endDate);
}
