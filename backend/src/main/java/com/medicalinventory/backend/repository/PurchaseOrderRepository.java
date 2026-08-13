package com.medicalinventory.backend.repository;

import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    boolean existsByMedicineAndStatusIgnoreCase(Medicine medicine, String status);

    @Modifying
    @Query("UPDATE PurchaseOrder p SET p.medicine = null WHERE p.medicine = :medicine")
    void unlinkMedicineFromPurchaseOrders(@Param("medicine") Medicine medicine);
}