package com.medistock.backend.repository;

import com.medistock.backend.model.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StockLogRepository 
    extends JpaRepository<StockLog, Long> {
    List<StockLog> findByMedicineIdOrderByCreatedAtDesc(
        Long medicineId);
    List<StockLog> findAllByOrderByCreatedAtDesc();


    @Transactional
    void deleteByMedicineId(Long medicineId);
}