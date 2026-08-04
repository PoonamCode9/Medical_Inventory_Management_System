package com.MediStock.app.repositories;

import com.MediStock.app.entities.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findAllByOrderByNameAsc();

    List<Medicine> findByCategory(String category);

    List<Medicine> findByCategoryContainingIgnoreCase(String category);

    List<Medicine> findBySupplier_SupplierId(Long supplierId);

    List<Medicine> findByNameContainingIgnoreCase(String name);

}