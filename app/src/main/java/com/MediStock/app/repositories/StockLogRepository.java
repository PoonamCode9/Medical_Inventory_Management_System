package com.MediStock.app.repositories;

import com.MediStock.app.entities.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {

    List<StockLog> findByBatchId(Long batchId);

}
