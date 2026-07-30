package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer>{

    List<PurchaseOrder> findByStatusContainingIgnoreCase(String keyword);


}