package com.medistock.backend.service;

import com.medistock.backend.dto.InventoryDTO;
import com.medistock.backend.model.Inventory;
import java.util.List;

public interface InventoryService {
    List<InventoryDTO> getAllInventory();
    List<InventoryDTO> getInventoryByMedicine(Long medicineId);
    Inventory getInventoryById(Long id);
    InventoryDTO createInventory(InventoryDTO inventoryDTO);
    InventoryDTO updateInventory(Long id, InventoryDTO inventoryDTO);
    void deleteInventory(Long id);
}
