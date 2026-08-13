package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.ExpiryTracking;
import com.medistock.entity.Inventory;

public interface ExpiryTrackingRepository extends JpaRepository<ExpiryTracking, Long> {
      long countByStatus(String status);
      public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    long countByQuantityLessThan(int quantity);

}
}