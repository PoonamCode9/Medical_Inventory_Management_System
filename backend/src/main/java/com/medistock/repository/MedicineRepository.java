package com.medistock.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);

    List<Medicine> findByCategoryContainingIgnoreCase(String category);

    List<Medicine> findBySupplierContainingIgnoreCase(String supplier);

    List<Medicine> findByBatchNumberContainingIgnoreCase(String batchNumber);

    List<Medicine> findByExpiryDateContaining(String expiryDate);

List<Medicine> findByExpiryDate(String expiryDate);

}