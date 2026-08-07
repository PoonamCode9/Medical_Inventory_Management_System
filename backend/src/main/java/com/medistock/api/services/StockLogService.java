package com.medistock.api.services;

import com.medistock.api.dto.StockLogDTO;
import com.medistock.api.repositories.StockLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StockLogService {

    private final StockLogRepository stockLogRepository;

    public StockLogService(StockLogRepository stockLogRepository) {
        this.stockLogRepository = stockLogRepository;
    }

    /**
     * Returns a paginated list of all stock movements, newest first.
     */
    public Page<StockLogDTO> getRecentLogs(Pageable pageable) {
        return stockLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(StockLogDTO::fromEntity);
    }
}
