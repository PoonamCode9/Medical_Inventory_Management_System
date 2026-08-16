package com.medistock.backend.repository;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Optional<Inventory> findByMedicine(Medicine medicine);

    @Query("SELECT i FROM Inventory i LEFT JOIN FETCH i.medicine m LEFT JOIN FETCH m.category LEFT JOIN FETCH m.supplier")
    List<Inventory> findAllWithDetails();

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i")
    long sumTotalQuantity();

    @Query("SELECT COALESCE(SUM(i.quantity * COALESCE(m.sellingPrice, m.purchasePrice, m.unitPrice, 0)), 0) FROM Inventory i LEFT JOIN i.medicine m")
    BigDecimal sumInventoryValue();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity > 0")
    long countAvailableStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity > 0 AND i.quantity <= COALESCE(i.minimumStock, 10)")
    long countLowStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity = 0")
    long countOutOfStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity > COALESCE(i.minimumStock, 10)")
    long countGoodStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity > 0 AND i.quantity <= 3")
    long countCriticalStock();
}
