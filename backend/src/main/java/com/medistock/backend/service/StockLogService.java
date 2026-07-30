package com.medistock.backend.service;

import java.util.List;

import com.medistock.backend.dto.StockLogDTO;

public interface StockLogService {

    List<StockLogDTO> getAllLogs();

    StockLogDTO getLogById(Integer id);

    List<StockLogDTO> getLogsByInventory(Integer inventoryId);

    void createLog(Integer inventoryId,
                   String movementType,
                   Integer quantity,
                   Integer referenceId);

}