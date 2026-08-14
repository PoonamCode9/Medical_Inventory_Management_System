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
        createLog(medicine, -quantitySold, "SOLD", "Medicine dispensed", beforeQty, afterQty, performedBy);
    }

    // Expired Stock Removal Log
    public void logExpiryRemoval(Medicine medicine, Integer expiredQty, Integer beforeQty, Integer afterQty, String performedBy) {
        createLog(medicine, -expiredQty, "REMOVED_EXPIRED", "Removed expired stock from inventory", beforeQty, afterQty, performedBy);
    }

    // Damaged Stock Log
    public void logDamagedRemoval(Medicine medicine, Integer damagedQty, Integer beforeQty, Integer afterQty, String reason, String performedBy) {
        createLog(medicine, -damagedQty, "REMOVED_DAMAGED", "Damaged stock removed: " + reason, beforeQty, afterQty, performedBy);
    }

    public List<StockLogDTO> getAllLogs() {
        return stockLogRepository.findAllByOrderByLogDateDesc().stream().map(log -> {
            Medicine med = log.getMedicine();
            
            Long medicineId = (med != null) ? med.getMedicineId() : null;
            String medicineName = (med != null) ? med.getMedicineName() : "Deleted Medicine";
            String batchNo = (med != null) ? med.getBatchNo() : "N/A";

            return new StockLogDTO(
                log.getLogId(),
                medicineId,
                medicineName,
                batchNo,
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
