package com.medistock.backend.service;

import com.medistock.backend.dto.InventoryDTO;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.Inventory;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    private void updateMedicineStock(Medicine medicine) {
        List<Inventory> batches = inventoryRepository.findByMedicineId(medicine.getId());
        int totalStock = batches.stream().mapToInt(Inventory::getQuantity).sum();
        medicine.setStockQuantity(totalStock);
        medicineRepository.save(medicine);
        notificationService.checkLowStockAndCreateNotifications();
        notificationService.checkExpiryAndCreateNotifications();
    }

    @Override
    public List<InventoryDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(InventoryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryDTO> getInventoryByMedicine(Long medicineId) {
        return inventoryRepository.findByMedicineId(medicineId).stream()
                .map(InventoryDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory batch not found with id: " + id));
    }

    @Override
    public InventoryDTO createInventory(InventoryDTO dto) {
        Medicine medicine = medicineRepository.findById(dto.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + dto.getMedicineId()));

        Inventory inventory = new Inventory(
                medicine,
                dto.getBatchNumber(),
                dto.getQuantity() != null ? dto.getQuantity() : 0,
                dto.getExpiryDate(),
                dto.getLocation()
        );

        Inventory saved = inventoryRepository.save(inventory);
        updateMedicineStock(medicine);

        auditLogService.logAction("CREATE_INVENTORY_BATCH", "Created batch " + saved.getBatchNumber() + " for " + medicine.getName() + " with qty " + saved.getQuantity());
        return new InventoryDTO(saved);
    }

    @Override
    public InventoryDTO updateInventory(Long id, InventoryDTO dto) {
        Inventory existing = getInventoryById(id);
        existing.setBatchNumber(dto.getBatchNumber());
        existing.setQuantity(dto.getQuantity());
        existing.setExpiryDate(dto.getExpiryDate());
        existing.setLocation(dto.getLocation());

        Inventory saved = inventoryRepository.save(existing);
        updateMedicineStock(saved.getMedicine());

        auditLogService.logAction("UPDATE_INVENTORY_BATCH", "Updated batch " + saved.getBatchNumber() + " for " + saved.getMedicine().getName());
        return new InventoryDTO(saved);
    }

    @Override
    public void deleteInventory(Long id) {
        Inventory existing = getInventoryById(id);
        Medicine medicine = existing.getMedicine();
        inventoryRepository.delete(existing);
        updateMedicineStock(medicine);

        auditLogService.logAction("DELETE_INVENTORY_BATCH", "Deleted batch " + existing.getBatchNumber() + " for " + medicine.getName());
    }
}
