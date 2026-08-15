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
     * Expired batch records are intentionally KEPT in the database so they
     * remain visible in the Expiry report (Expired section). Only zero-quantity
     * batches are hidden from views/reports by queries that filter available_qty > 0.
     */
    @Transactional
    public void cleanup() {
        // expired batches are retained for the Expiry view; nothing is deleted here
    }
}
