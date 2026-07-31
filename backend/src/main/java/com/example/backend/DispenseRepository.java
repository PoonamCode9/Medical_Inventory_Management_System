package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DispenseRepository extends JpaRepository<Dispense, Integer> {

    @Query(value = "SELECT TO_CHAR(d.created_at, 'YYYY-MM') AS month, SUM(di.quantity) AS total " +
           "FROM dispenses d JOIN dispense_items di ON di.dispense_id = d.id " +
           "GROUP BY TO_CHAR(d.created_at, 'YYYY-MM') " +
           "ORDER BY TO_CHAR(d.created_at, 'YYYY-MM') ASC", nativeQuery = true)
    List<Object[]> findMonthlyDispenseTotals();
}

