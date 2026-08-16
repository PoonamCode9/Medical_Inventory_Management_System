package com.MediStock.app.repositories;

import com.MediStock.app.entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository
        extends JpaRepository<Sale, Long> {

    /*
     * ============================================================
     * SALES HISTORY
     * ============================================================
     */

    List<Sale> findAllByOrderBySaleDateDesc();


    /*
     * ============================================================
     * SALES FOR A SPECIFIC INVENTORY BATCH
     * ============================================================
     */

    List<Sale> findByInventory_BatchId(
            Long batchId
    );


    /*
     * ============================================================
     * SALES BETWEEN DATES
     * ============================================================
     */

    List<Sale> findBySaleDateBetweenOrderBySaleDateDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );


    /*
     * ============================================================
     * TOTAL SALES / REVENUE
     * ============================================================
     */

    @Query("""
        SELECT COALESCE(SUM(s.totalAmount), 0)
        FROM Sale s
    """)
    BigDecimal getTotalSales();


    /*
     * ============================================================
     * TOTAL UNITS SOLD
     * ============================================================
     */

    @Query("""
        SELECT COALESCE(SUM(s.quantity), 0)
        FROM Sale s
    """)
    Long getTotalUnitsSold();


    /*
     * ============================================================
     * SALES REVENUE BETWEEN DATES
     * ============================================================
     */

    @Query("""
        SELECT COALESCE(SUM(s.totalAmount), 0)
        FROM Sale s
        WHERE s.saleDate >= :startDate
        AND s.saleDate < :endDate
    """)
    BigDecimal getTotalSalesBetween(
            @Param("startDate")
            LocalDateTime startDate,

            @Param("endDate")
            LocalDateTime endDate
    );

}