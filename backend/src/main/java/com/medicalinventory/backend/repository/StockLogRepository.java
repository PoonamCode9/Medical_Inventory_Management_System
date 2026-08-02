package com.medicalinventory.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicalinventory.backend.entity.StockLog;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    List<StockLog> findAllByOrderByLogDateDesc();
}