package com.medistock.backend.repository;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Optional<Inventory> findByMedicine(Medicine medicine);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Inventory i LEFT JOIN FETCH i.medicine m LEFT JOIN FETCH m.category LEFT JOIN FETCH m.supplier")
    java.util.List<Inventory> findAllWithDetails();
}
