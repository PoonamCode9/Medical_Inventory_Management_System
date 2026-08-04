package com.MediStock.app.services;

import com.MediStock.app.dto.InventoryRequest;
import com.MediStock.app.dto.InventoryResponse;
import com.MediStock.app.dto.InventorySummaryResponse;

import java.util.List;

public interface InventoryService {

    List<InventoryResponse> getAllInventory();

    InventoryResponse getInventoryById(Long batchId);

    InventoryResponse addInventory(InventoryRequest request);

    InventoryResponse updateInventory(Long batchId,
                                      InventoryRequest request);

    void deleteInventory(Long batchId);

    InventorySummaryResponse getInventorySummary();

    List<InventoryResponse> searchByMedicineName(String name);

    List<InventoryResponse> searchByCategory(String category);

}