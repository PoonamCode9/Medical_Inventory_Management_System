package com.medistock.api.repositories;

import com.medistock.api.models.PurchaseOrder;
import com.medistock.api.models.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Page<PurchaseOrder> findAllByOrderByOrderDateDesc(Pageable pageable);

    long countByStatus(PurchaseOrderStatus status);

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM PurchaseOrder p WHERE p.status = :status")
    Double sumTotalAmountByStatus(PurchaseOrderStatus status);

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM PurchaseOrder p")
    Double sumAllTotalAmount();
}
