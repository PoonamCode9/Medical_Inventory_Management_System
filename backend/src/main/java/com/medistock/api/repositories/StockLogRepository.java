package com.medistock.api.repositories;

import com.medistock.api.models.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    List<StockLog> findByMedicineIdOrderByTimestampDesc(Long medicineId);
}
