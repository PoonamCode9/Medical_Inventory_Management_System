package com.medistock.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.medistock.entity.StockLog;
import com.medistock.service.StockLogService;

@RestController
@RequestMapping("/api/stocklogs")
public class StockLogController {

    private final StockLogService stockLogService;

    public StockLogController(StockLogService stockLogService) {
        this.stockLogService = stockLogService;
    }

    @PostMapping
    public StockLog addStockLog(@RequestBody StockLog stockLog) {
        return stockLogService.addStockLog(stockLog);
    }

    @GetMapping
    public List<StockLog> getAllStockLogs() {
        return stockLogService.getAllStockLogs();
    }

    @GetMapping("/{id}")
    public StockLog getStockLogById(@PathVariable Long id) {
        return stockLogService.getStockLogById(id);
    }

    @PutMapping("/{id}")
    public StockLog updateStockLog(@PathVariable Long id,
                                   @RequestBody StockLog stockLog) {
        return stockLogService.updateStockLog(id, stockLog);
    }

    @DeleteMapping("/{id}")
    public String deleteStockLog(@PathVariable Long id) {
        stockLogService.deleteStockLog(id);
        return "Stock Log deleted successfully";
    }
}