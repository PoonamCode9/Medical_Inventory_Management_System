package com.medistock.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.StockLogDTO;
import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.StockLog;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.StockLogRepository;
import com.medistock.backend.service.StockLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockLogServiceImpl implements StockLogService {

    private final StockLogRepository stockLogRepository;

    private final InventoryRepository inventoryRepository;
    

    @Override
    public List<StockLogDTO> getAllLogs() {

        return stockLogRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StockLogDTO getLogById(Integer id) {

        StockLog log = stockLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        return convertToDTO(log);
    }

    @Override
    public List<StockLogDTO> getLogsByInventory(Integer inventoryId) {

        return stockLogRepository.findByInventory_InventoryId(inventoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void createLog(Integer inventoryId,
                          String movementType,
                          Integer quantity,
                          Integer referenceId) {

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        StockLog log = new StockLog();

        log.setInventory(inventory);
        log.setMovementType(movementType);
        log.setQuantity(quantity);
        log.setReferenceId(referenceId);
        log.setTransactionDate(LocalDateTime.now());

        stockLogRepository.save(log);
    }

    private StockLogDTO convertToDTO(StockLog log) {

        StockLogDTO dto = new StockLogDTO();

        dto.setLogId(log.getLogId());

        dto.setInventoryId(log.getInventory().getInventoryId());

        dto.setMedicineName(
                log.getInventory().getMedicine().getMedicineName());

        dto.setMovementType(log.getMovementType());

        dto.setQuantity(log.getQuantity());

        dto.setReferenceId(log.getReferenceId());

        dto.setTransactionDate(log.getTransactionDate());

        return dto;
    }
}