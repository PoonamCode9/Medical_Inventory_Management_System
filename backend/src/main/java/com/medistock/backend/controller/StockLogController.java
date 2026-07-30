package com.medistock.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.medistock.backend.dto.StockLogDTO;
import com.medistock.backend.service.StockLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stocklogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StockLogController {

    private final StockLogService stockLogService;

    @GetMapping
    public List<StockLogDTO> getAllLogs() {

        return stockLogService.getAllLogs();
    }

    @GetMapping("/{id}")
    public StockLogDTO getLogById(
            @PathVariable Integer id) {

        return stockLogService.getLogById(id);
    }

    @GetMapping("/inventory/{inventoryId}")
    public List<StockLogDTO> getInventoryLogs(
            @PathVariable Integer inventoryId) {

        return stockLogService.getLogsByInventory(inventoryId);
    }
}