package com.example.medistock.medistock.service;

import com.example.medistock.medistock.model.Inventory;
import com.example.medistock.medistock.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpiryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getExpiringBatches(int daysThreshold) {
        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusDays(daysThreshold);

        return inventoryRepository.findAll().stream()
                .filter(item -> item.getExpiryDate() != null &&
                        !item.getExpiryDate().isBefore(today) &&
                        !item.getExpiryDate().isAfter(thresholdDate))
                .collect(Collectors.toList());
    }

    public List<Inventory> getExpiredBatches() {
        LocalDate today = LocalDate.now();
        return inventoryRepository.findAll().stream()
                .filter(item -> item.getExpiryDate() != null && item.getExpiryDate().isBefore(today))
                .collect(Collectors.toList());
    }
}