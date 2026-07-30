package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.StockLog;

public interface StockLogRepository extends JpaRepository<StockLog, Integer> {

    List<StockLog> findByInventory_InventoryId(Integer inventoryId);

    List<StockLog> findByMovementType(String movementType);

}