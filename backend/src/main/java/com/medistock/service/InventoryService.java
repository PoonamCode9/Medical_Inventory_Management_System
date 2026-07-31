package com.medistock.service;

import java.util.List;

import com.medistock.entity.Inventory;

public interface InventoryService {

    Inventory addInventory(Inventory inventory);

    List<Inventory> getAllInventory();

    Inventory getInventoryById(Long id);

    Inventory updateInventory(Long id, Inventory inventory);

    void deleteInventory(Long id);
}