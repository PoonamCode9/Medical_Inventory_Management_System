package com.medistock.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.Inventory;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.service.InventoryService;
import com.medistock.backend.service.NotificationService;
import com.medistock.backend.service.StockLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final MedicineRepository medicineRepository;
    private final NotificationService notificationService;
private final StockLogService stockLogService;
    @Override
    public List<Inventory> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Inventory getInventoryById(Integer id) {

        com.medistock.backend.entity.Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return convertToDTO(inventory);
    }

    @Override
    public Inventory addInventory(Inventory dto) {

        Medicine medicine = medicineRepository.findById(dto.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        com.medistock.backend.entity.Inventory inventory = new com.medistock.backend.entity.Inventory();

        inventory.setMedicine(medicine);
        inventory.setQuantityAvailable(dto.getQuantityAvailable());
        inventory.setMinimumStock(dto.getMinimumStock());
        inventory.setLastUpdated(LocalDateTime.now());

        com.medistock.backend.entity.Inventory savedInventory = inventoryRepository.save(inventory);

        notificationService.createNotification(
                1,
                savedInventory.getMedicine().getMedicineName() + " added to inventory.",
                "INVENTORY"
        );
        stockLogService.createLog(
        savedInventory.getInventoryId(),
        "ADD",
        savedInventory.getQuantityAvailable(),
        savedInventory.getInventoryId()
);

        if (savedInventory.getQuantityAvailable() <= savedInventory.getMinimumStock()) {

            notificationService.createNotification(
                    1,
                    savedInventory.getMedicine().getMedicineName()
                            + " stock is LOW. Remaining quantity: "
                            + savedInventory.getQuantityAvailable(),
                    "LOW_STOCK"
            );
        }

        return convertToDTO(savedInventory);
    }

    @Override
    public Inventory updateInventory(Integer id, Inventory dto) {

        com.medistock.backend.entity.Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setQuantityAvailable(dto.getQuantityAvailable());
        inventory.setMinimumStock(dto.getMinimumStock());
        inventory.setLastUpdated(LocalDateTime.now());

        com.medistock.backend.entity.Inventory updatedInventory = inventoryRepository.save(inventory);

        stockLogService.createLog(
        updatedInventory.getInventoryId(),
        "UPDATE",
        updatedInventory.getQuantityAvailable(),
        updatedInventory.getInventoryId()
);

        if (updatedInventory.getQuantityAvailable() == 0) {

            notificationService.createNotification(
                    1,
                    updatedInventory.getMedicine().getMedicineName()
                            + " is OUT OF STOCK.",
                    "OUT_OF_STOCK"
            );

        } else if (updatedInventory.getQuantityAvailable()
                <= updatedInventory.getMinimumStock()) {

            notificationService.createNotification(
                    1,
                    updatedInventory.getMedicine().getMedicineName()
                            + " stock is LOW. Remaining quantity: "
                            + updatedInventory.getQuantityAvailable(),
                    "LOW_STOCK"
            );

        } else {

            notificationService.createNotification(
                    1,
                    updatedInventory.getMedicine().getMedicineName()
                            + " stock has been replenished.",
                    "INVENTORY"
            );
        }

        return convertToDTO(updatedInventory);
    }

    @Override
    public void deleteInventory(Integer id) {

        com.medistock.backend.entity.Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        notificationService.createNotification(
                1,
                inventory.getMedicine().getMedicineName()
                        + " removed from inventory.",
                "INVENTORY"
        );
stockLogService.createLog(
        inventory.getInventoryId(),
        "DELETE",
        inventory.getQuantityAvailable(),
        inventory.getInventoryId()
);
        inventoryRepository.deleteById(id);
    }

    @Override
    public List<Inventory> searchInventory(String keyword) {

        return inventoryRepository
                .findByMedicine_MedicineNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Inventory convertToDTO(com.medistock.backend.entity.Inventory inventory) {

        Inventory dto = new Inventory();

        dto.setInventoryId(inventory.getInventoryId());
        dto.setMedicineId(inventory.getMedicine().getMedicineId());
        dto.setMedicineName(inventory.getMedicine().getMedicineName());
        dto.setQuantityAvailable(inventory.getQuantityAvailable());
        dto.setMinimumStock(inventory.getMinimumStock());
        dto.setLastUpdated(inventory.getLastUpdated());

        return dto;
    }
}