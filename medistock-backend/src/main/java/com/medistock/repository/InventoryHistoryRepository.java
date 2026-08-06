package com.medistock.repository;

import com.medistock.entity.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryHistoryRepository
        extends JpaRepository<InventoryHistory,Long>{

}