package com.medistock.backend.service;

import com.medistock.backend.entity.Inventory;
import com.medistock.backend.entity.StockLog;
import java.util.List;

public interface InventoryService {
    List<Inventory> getAllInventory();
    Inventory getInventoryByMedicineId(Integer medicineId);
    Inventory stockIn(Integer medicineId, Integer quantity, String reason, String email);
    Inventory stockOut(Integer medicineId, Integer quantity, String reason, String email);
    Inventory adjustStock(Integer medicineId, Integer quantity, Integer minimumStock, Integer maximumStock, String reason, String email);
    List<StockLog> getStockLogs();
}
