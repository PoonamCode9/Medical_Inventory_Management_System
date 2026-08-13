package com.medicalinventory.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.StockLog;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    List<StockLog> findAllByOrderByLogDateDesc();

    @Modifying
    @Query("UPDATE StockLog s SET s.medicine = null WHERE s.medicine = :medicine")
    void unlinkMedicineFromStockLogs(@Param("medicine") Medicine medicine);
}