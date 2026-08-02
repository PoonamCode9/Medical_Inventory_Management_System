package com.medicalinventory.controller;

import com.medicalinventory.repository.StockLogRepository;
import org.springframework.web.bind.annotation.*;
import com.medicalinventory.dto.StockLogResponse;

import java.util.List;

@RestController
@RequestMapping("/stock-logs")
@CrossOrigin(origins = "*")
public class StockLogController {

    private final StockLogRepository stockLogRepository;

    public StockLogController(StockLogRepository stockLogRepository) {
        this.stockLogRepository = stockLogRepository;
    }

    @GetMapping
    public List<StockLogResponse> getAllStockLogs() {

        return stockLogRepository.findAll()
                .stream()
                .map(log -> new StockLogResponse(
                        log.getLogId(),
                        log.getMedicine().getMedicineName(),
                        log.getMedicine().getManufacturer(),
                        log.getMedicine().getExpiryDate().toString(),
                        log.getMedicine().getSupplier().getSupplierName(),
                        log.getOldQuantity(),
                        log.getAction(),
                        log.getQuantity(),
                        log.getNewQuantity(),
                        log.getUser().getFullName(),
                        log.getUser().getRole().getName(),
                        log.getActionDate(),
                        log.getRemarks()))
                .toList();
    }
}