package com.medistock.backend.controller;

import com.medistock.backend.model.StockLog;
import com.medistock.backend.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class StockLogController {

    @Autowired
    private StockLogRepository stockLogRepository;

    @GetMapping
    public ResponseEntity<List<StockLog>> getAllLogs() {
        return ResponseEntity.ok(
            stockLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<StockLog>> getLogsByMedicine(
            @PathVariable Long medicineId) {
        return ResponseEntity.ok(
            stockLogRepository
                .findByMedicineIdOrderByCreatedAtDesc(medicineId));
    }

    @PostMapping
    public ResponseEntity<StockLog> addLog(
            @RequestBody StockLog stockLog) {
        return ResponseEntity.ok(
            stockLogRepository.save(stockLog));
    }
}