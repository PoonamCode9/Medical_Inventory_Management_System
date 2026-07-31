package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseOrderStatusHistoryRepository extends JpaRepository<PurchaseOrderStatusHistory, Long> {
    List<PurchaseOrderStatusHistory> findByPurchaseOrder_PoNumberOrderByChangedAtAsc(String poNumber);
}

