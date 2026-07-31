package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.StockLog;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {

}