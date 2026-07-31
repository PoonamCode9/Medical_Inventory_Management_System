package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.StockLog;
import com.medistock.repository.StockLogRepository;
import com.medistock.service.StockLogService;

@Service
public class StockLogServiceImpl implements StockLogService {

    private final StockLogRepository stockLogRepository;

    public StockLogServiceImpl(StockLogRepository stockLogRepository) {
        this.stockLogRepository = stockLogRepository;
    }

    @Override
    public StockLog addStockLog(StockLog stockLog) {
        return stockLogRepository.save(stockLog);
    }

    @Override
    public List<StockLog> getAllStockLogs() {
        return stockLogRepository.findAll();
    }

    @Override
    public StockLog getStockLogById(Long id) {
        return stockLogRepository.findById(id).orElse(null);
    }

    @Override
    public StockLog updateStockLog(Long id, StockLog stockLog) {

        StockLog existing = stockLogRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setAction(stockLog.getAction());
            existing.setQuantity(stockLog.getQuantity());
            existing.setDate(stockLog.getDate());
            existing.setMedicine(stockLog.getMedicine());

            return stockLogRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteStockLog(Long id) {
        stockLogRepository.deleteById(id);
    }
}