package com.medistock.demo.repository;


import com.medistock.demo.entity.Medicine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


public interface MedicineRepository
        extends JpaRepository<Medicine, Long> {


    // ==================================================
    // SEARCH
    // ==================================================

    List<Medicine> findByNameContainingIgnoreCase(
            String keyword
    );


    // ==================================================
    // CATEGORY
    // ==================================================

    List<Medicine> findByCategoryIgnoreCase(
            String category
    );


    // ==================================================
    // LOW STOCK
    // ==================================================

    @Query("""
            SELECT m
            FROM Medicine m
            WHERE m.quantity <= m.minStockLevel
            """)
    List<Medicine> findLowStockMedicines();


    // ==================================================
    // LOW STOCK COUNT
    // ==================================================

    @Query("""
            SELECT COUNT(m)
            FROM Medicine m
            WHERE m.quantity <= m.minStockLevel
            """)
    long countLowStockMedicines();


    // ==================================================
    // QUANTITY LESS THAN
    // ==================================================

    long countByQuantityLessThan(
            Integer quantity
    );


    // ==================================================
    // EXPIRED
    // ==================================================

    List<Medicine> findByExpiryDateBefore(
            LocalDate date
    );


    // ==================================================
    // EXPIRED COUNT
    // ==================================================

    long countByExpiryDateBefore(
            LocalDate date
    );


    // ==================================================
    // NEAR EXPIRY
    // ==================================================

    @Query("""
            SELECT m
            FROM Medicine m
            WHERE m.expiryDate
            BETWEEN :today AND :futureDate
            """)
    List<Medicine> findNearExpiry(

            @Param("today")
            LocalDate today,

            @Param("futureDate")
            LocalDate futureDate

    );


    // ==================================================
    // TOTAL STOCK
    // ==================================================

    @Query("""
            SELECT COALESCE(SUM(m.quantity), 0)
            FROM Medicine m
            """)
    Long getTotalStock();


    // ==================================================
    // TOTAL STOCK VALUE
    // ==================================================

    @Query("""
            SELECT COALESCE(SUM(m.quantity * m.price), 0)
            FROM Medicine m
            """)
    Double getTotalStockValue();


    // ==================================================
    // CATEGORY COUNT
    // ==================================================

    long countByCategory(
            String category
    );

}