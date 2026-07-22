package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findTop5ByOrderByIdDesc();
    Optional<Inventory> findByMedicine_IdAndBatch(Long medicineId, String batch);
}
