package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

}