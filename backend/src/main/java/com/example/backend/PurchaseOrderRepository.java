package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    boolean existsByPoNumber(String poNumber);

    @Query(value = "SELECT TO_CHAR(po.order_date, 'YYYY-MM') AS month, SUM(poi.quantity_ordered) AS total " +
           "FROM purchase_orders po JOIN purchase_order_items poi ON poi.purchase_order_id = po.id " +
           "GROUP BY TO_CHAR(po.order_date, 'YYYY-MM') " +
           "ORDER BY TO_CHAR(po.order_date, 'YYYY-MM') ASC", nativeQuery = true)
    List<Object[]> findMonthlyPurchaseTotals();
}

