package com.medistock.service;

import java.util.List;
import com.medistock.entity.StockLog;

public interface StockLogService {

    StockLog addStockLog(StockLog stockLog);

    List<StockLog> getAllStockLogs();

    StockLog getStockLogById(Long id);

    StockLog updateStockLog(Long id, StockLog stockLog);

    void deleteStockLog(Long id);
}