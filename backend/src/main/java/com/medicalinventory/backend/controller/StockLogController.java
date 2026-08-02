package com.medicalinventory.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalinventory.backend.dto.StockLogDTO;
import com.medicalinventory.backend.service.StockLogService;

@RestController
@RequestMapping("/api/stock-logs")
public class StockLogController {

    private final StockLogService stockLogService;

    public StockLogController(StockLogService stockLogService) {
        this.stockLogService = stockLogService;
    }

    @GetMapping
    public ResponseEntity<List<StockLogDTO>> getAllLogs() {
        return ResponseEntity.ok(stockLogService.getAllLogs());
    }
}