package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    long countByAvailableStockLessThan(int availableStock);

}