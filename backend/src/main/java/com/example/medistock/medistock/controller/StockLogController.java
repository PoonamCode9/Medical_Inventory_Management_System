package com.example.medistock.medistock.controller;

import com.example.medistock.medistock.model.StockLog;
import com.example.medistock.medistock.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-logs")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StockLogController {

    @Autowired
    private StockLogRepository stockLogRepository;

    @GetMapping
    public List<StockLog> getAllLogs() {
        return stockLogRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<StockLog> createLog(@RequestBody StockLog log) {
        return ResponseEntity.ok(stockLogRepository.save(log));
    }
}