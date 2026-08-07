package com.medistock.backend.repository;

import com.medistock.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    @Query("SELECT po.status, COUNT(po) FROM PurchaseOrder po GROUP BY po.status")
    List<Object[]> countOrdersByStatus();

    @Query("SELECT po.supplier.supplierName, SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.status IN ('DELIVERED', 'RECEIVED') GROUP BY po.supplier.supplierName ORDER BY SUM(po.totalAmount) DESC")
    List<Object[]> findTopSupplierByVolume();

    @Query("SELECT po.supplier.supplierName, COUNT(po) FROM PurchaseOrder po GROUP BY po.supplier.supplierName ORDER BY COUNT(po) DESC")
    List<Object[]> findSupplierPurchaseOrderCounts();

    @Query("SELECT COALESCE(AVG(po.totalAmount), 0.0) FROM PurchaseOrder po")
    double getAveragePurchaseVolume();
}
