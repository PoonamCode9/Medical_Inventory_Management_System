package com.medistock.backend.service;

import java.util.List;

import com.medistock.backend.dto.Inventory;

public interface InventoryService {

    List<Inventory> getAllInventory();

    Inventory getInventoryById(Integer id);

    Inventory addInventory(Inventory dto);

    Inventory updateInventory(Integer id, Inventory dto);

    void deleteInventory(Integer id);

    List<Inventory> searchInventory(String keyword);

}