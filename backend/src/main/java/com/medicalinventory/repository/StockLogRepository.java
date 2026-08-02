package com.medicalinventory.repository;

import com.medicalinventory.entity.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    boolean existsByMedicineMedicineId(Long medicineId);

}