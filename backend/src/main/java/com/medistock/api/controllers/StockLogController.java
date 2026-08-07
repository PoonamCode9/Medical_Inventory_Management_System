package com.medistock.api.controllers;

import com.medistock.api.dto.StockLogDTO;
import com.medistock.api.services.StockLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock-logs")
public class StockLogController {

    private final StockLogService stockLogService;

    public StockLogController(StockLogService stockLogService) {
        this.stockLogService = stockLogService;
    }

    /**
     * GET /api/stock-logs
     * Returns a paginated list of all stock adjustment records, newest first.
     * Accessible by all authenticated users.
     */
    @GetMapping
    public ResponseEntity<Page<StockLogDTO>> getStockLogs(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        return ResponseEntity.ok(stockLogService.getRecentLogs(pageable));
    }
}
