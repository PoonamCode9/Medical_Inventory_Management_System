package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.Inventory;
import com.medistock.repository.InventoryRepository;
import com.medistock.service.InventoryService;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public Inventory addInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    @Override
    public Inventory updateInventory(Long id, Inventory inventory) {

        Inventory existing = inventoryRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setAvailableStock(inventory.getAvailableStock());
            existing.setMinimumStock(inventory.getMinimumStock());
            existing.setMedicine(inventory.getMedicine());

            return inventoryRepository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
}