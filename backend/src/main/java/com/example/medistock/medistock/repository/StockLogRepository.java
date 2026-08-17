package com.example.medistock.medistock.repository;

import com.example.medistock.medistock.model.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
}