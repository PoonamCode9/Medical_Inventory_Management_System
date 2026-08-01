package com.medical.om.om_backend.service;

import com.medical.om.om_backend.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class InventoryCleanupService {

    private final InventoryRepository inventoryRepository;

    public InventoryCleanupService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    /**
     * Removes already-expired batch records from the database.
     * 0-quantity batches are intentionally KEPT in the database but hidden
     * from views/reports by the expiry query (available_qty > 0).
     */
    @Transactional
    public void cleanup() {
        inventoryRepository.deleteExpiredBefore(LocalDate.now());
    }
}
