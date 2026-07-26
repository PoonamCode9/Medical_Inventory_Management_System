package com.medistock.backend.repository;

import com.medistock.backend.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    List<Medicine> findByNameContainingIgnoreCase(String name);
    
    List<Medicine> findByCategory(String category);
    
    List<Medicine> findBySupplier(String supplier);
    
    List<Medicine> findByQuantityLessThan(Integer quantity);
    
    List<Medicine> findByStatus(String status);
}