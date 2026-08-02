package com.medicalinventory.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.medicalinventory.backend.dto.StockLogDTO;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.StockLog;
import com.medicalinventory.backend.repository.StockLogRepository;

@Service
public class StockLogService {
    private final StockLogRepository stockLogRepository;

    public StockLogService(StockLogRepository stockLogRepository) {
        this.stockLogRepository = stockLogRepository;
    }

    public void createLog(Medicine medicine, Integer quantityChanged, String action, String remarks, Integer quantityBefore, Integer quantityAfter, String performedBy) {
        StockLog log = new StockLog(medicine, quantityChanged, action, remarks, quantityBefore, quantityAfter, performedBy);
        stockLogRepository.save(log);
    }

    //  Sale/Dispense Stock Log
    public void logSale(Medicine medicine, Integer quantitySold, Integer beforeQty, Integer afterQty, String performedBy) {
        createLog(medicine, -quantitySold, "SALE", "Medicine dispensed", beforeQty, afterQty, performedBy);
    }

    // Expired Stock Removal Log
    public void logExpiryRemoval(Medicine medicine, Integer expiredQty, Integer beforeQty, Integer afterQty, String performedBy) {
        createLog(medicine, -expiredQty, "EXPIRED", "Removed expired stock from inventory", beforeQty, afterQty, performedBy);
    }

    // Damaged Stock Log
    public void logDamagedRemoval(Medicine medicine, Integer damagedQty, Integer beforeQty, Integer afterQty, String reason, String performedBy) {
        createLog(medicine, -damagedQty, "DAMAGED", "Damaged stock removed: " + reason, beforeQty, afterQty, performedBy);
    }

    public List<StockLogDTO> getAllLogs() {
        return stockLogRepository.findAllByOrderByLogDateDesc().stream().map(log -> {
            return new StockLogDTO(
                log.getLogId(),
                log.getMedicine().getMedicineId(),
                log.getMedicine().getMedicineName(),
                log.getMedicine().getBatchNo(),
                log.getQuantityChanged(),
                log.getAction(),
                log.getLogDate(),
                log.getRemarks(),
                log.getQuantityBefore(),
                log.getQuantityAfter(),
                log.getPerformedBy()
            );
        }).toList();
    }
}
