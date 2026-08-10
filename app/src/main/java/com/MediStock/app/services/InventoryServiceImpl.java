package com.MediStock.app.services;

import com.MediStock.app.dto.InventoryRequest;
import com.MediStock.app.dto.InventoryResponse;
import com.MediStock.app.dto.InventorySummaryResponse;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Medicine;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.enums.StockStatus;
import com.MediStock.app.repositories.InventoryRepository;
import com.MediStock.app.repositories.MedicineRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final InventoryRepository inventoryRepository;

    private final MedicineRepository medicineRepository;

    private final ActivityLogService activityLogService;

    public InventoryServiceImpl(

            InventoryRepository inventoryRepository,

            MedicineRepository medicineRepository,

            ActivityLogService activityLogService

    ) {

        this.inventoryRepository = inventoryRepository;

        this.medicineRepository = medicineRepository;

        this.activityLogService = activityLogService;

    }

    @Override
    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAllByOrderByBatchIdAsc()
                .stream()
                .map(this::convertToResponse)
                .toList();

    }

    @Override
    public InventoryResponse getInventoryById(Long batchId) {

        Inventory inventory = inventoryRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Inventory batch not found."));

        return convertToResponse(inventory);

    }

    @Override
    public InventoryResponse addInventory(InventoryRequest request) {

        if (request.getQuantity() < 0) {
            throw new RuntimeException("Quantity cannot be negative.");
        }

        if (request.getExpDate().isBefore(request.getMfgDate())) {
            throw new RuntimeException(
                    "Expiry date cannot be before manufacture date.");
        }

        if (inventoryRepository.findByBatchNumber(
                request.getBatchNumber()).isPresent()) {

            throw new RuntimeException("Batch number already exists.");
        }

        Medicine medicine = medicineRepository.findById(
                request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found."));

        Inventory inventory = new Inventory();

        inventory.setMedicine(medicine);
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setQuantity(request.getQuantity());
        inventory.setMfgDate(request.getMfgDate());
        inventory.setExpDate(request.getExpDate());

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        activityLogService.logActivity(

                ActivityModule.INVENTORY,

                ActivityAction.CREATED,

                savedInventory.getBatchId(),

                savedInventory.getBatchNumber(),

                "Added inventory batch " +
                        savedInventory.getBatchNumber() +
                        " for medicine " +
                        savedInventory.getMedicine().getName()

        );

        return convertToResponse(savedInventory);

    }

    @Override
    public InventoryResponse updateInventory(

            Long batchId,

            InventoryRequest request

    ) {

        Inventory inventory = inventoryRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Inventory batch not found."));

        if (request.getQuantity() < 0) {
            throw new RuntimeException("Quantity cannot be negative.");
        }

        if (request.getExpDate().isBefore(request.getMfgDate())) {
            throw new RuntimeException(
                    "Expiry date cannot be before manufacture date.");
        }

        Medicine medicine = medicineRepository.findById(
                request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found."));

        inventory.setMedicine(medicine);
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setQuantity(request.getQuantity());
        inventory.setMfgDate(request.getMfgDate());
        inventory.setExpDate(request.getExpDate());

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        activityLogService.logActivity(

                ActivityModule.INVENTORY,

                ActivityAction.UPDATED,

                updatedInventory.getBatchId(),

                updatedInventory.getBatchNumber(),

                "Updated inventory batch " +
                        updatedInventory.getBatchNumber()

        );

        return convertToResponse(updatedInventory);

    }

    @Override
    public void deleteInventory(Long batchId) {

        Inventory inventory = inventoryRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Inventory batch not found."));

        activityLogService.logActivity(

                ActivityModule.INVENTORY,

                ActivityAction.DELETED,

                inventory.getBatchId(),

                inventory.getBatchNumber(),

                "Deleted inventory batch " +
                        inventory.getBatchNumber()

        );

        inventoryRepository.delete(inventory);

    }

    @Override
    public InventorySummaryResponse getInventorySummary() {

        List<Inventory> inventoryList = inventoryRepository.findAll();

        InventorySummaryResponse summary = new InventorySummaryResponse();

        summary.setTotalBatches(inventoryList.size());

        summary.setTotalMedicines(
                (int) inventoryList.stream()
                        .map(inventory -> inventory.getMedicine().getMedicineId())
                        .distinct()
                        .count());

        summary.setTotalUnits(
                inventoryList.stream()
                        .mapToInt(inventory ->
                                inventory.getQuantity() == null
                                        ? 0
                                        : inventory.getQuantity())
                        .sum());

        summary.setLowStockCount(
                (int) inventoryList.stream()
                        .filter(inventory ->
                                inventory.getQuantity() <= LOW_STOCK_THRESHOLD)
                        .count());

        summary.setExpiredCount(
                (int) inventoryList.stream()
                        .filter(inventory ->
                                inventory.getExpDate().isBefore(LocalDate.now()))
                        .count());

        summary.setExpiringSoonCount(
                (int) inventoryList.stream()
                        .filter(inventory -> {

                            LocalDate today = LocalDate.now();

                            return !inventory.getExpDate().isBefore(today)
                                    && !inventory.getExpDate().isAfter(today.plusDays(30));

                        })
                        .count());

        summary.setTotalInventoryValue(
                calculateInventoryValue(inventoryList));

        summary.setHighestValueMedicine(
                calculateHighestValueMedicine(inventoryList));

        summary.setHighestValue(
                calculateHighestValue(inventoryList));

        summary.setLowestStockMedicine(
                calculateLowestStockMedicine(inventoryList));

        summary.setLowestStockQuantity(
                calculateLowestStockQuantity(inventoryList));

        return summary;

    }

        @Override
    public List<InventoryResponse> searchByMedicineName(String name) {

        return inventoryRepository
                .findByMedicine_NameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponse)
                .toList();

    }

    @Override
    public List<InventoryResponse> searchByCategory(String category) {

        return inventoryRepository
                .findByMedicine_CategoryContainingIgnoreCase(category)
                .stream()
                .map(this::convertToResponse)
                .toList();

    }

    private BigDecimal calculateInventoryValue(
            List<Inventory> inventoryList
    ) {

        BigDecimal totalValue = BigDecimal.ZERO;

        for (Inventory inventory : inventoryList) {

            BigDecimal batchValue = inventory.getMedicine()
                    .getPrice()
                    .multiply(
                            BigDecimal.valueOf(
                                    inventory.getQuantity()
                            )
                    );

            totalValue = totalValue.add(batchValue);

        }

        return totalValue;

    }

    private String calculateHighestValueMedicine(
            List<Inventory> inventoryList
    ) {

        return inventoryList.stream()
                .max((a, b) ->

                        a.getMedicine()
                                .getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                a.getQuantity()
                                        )
                                )
                                .compareTo(

                                        b.getMedicine()
                                                .getPrice()
                                                .multiply(
                                                        BigDecimal.valueOf(
                                                                b.getQuantity()
                                                        )
                                                )

                                )

                )
                .map(inventory ->
                        inventory.getMedicine().getName()
                )
                .orElse("N/A");

    }

    private BigDecimal calculateHighestValue(
            List<Inventory> inventoryList
    ) {

        BigDecimal highestValue = BigDecimal.ZERO;

        for (Inventory inventory : inventoryList) {

            BigDecimal batchValue = inventory.getMedicine()
                    .getPrice()
                    .multiply(
                            BigDecimal.valueOf(
                                    inventory.getQuantity()
                            )
                    );

            if (batchValue.compareTo(highestValue) > 0) {

                highestValue = batchValue;

            }

        }

        return highestValue;

    }

    private String calculateLowestStockMedicine(
            List<Inventory> inventoryList
    ) {

        return inventoryList.stream()

                .min((a, b) ->

                        Integer.compare(
                                a.getQuantity(),
                                b.getQuantity()
                        )

                )

                .map(inventory ->
                        inventory.getMedicine().getName()
                )

                .orElse("N/A");

    }

    private Integer calculateLowestStockQuantity(
        List<Inventory> inventoryList
) {

    return inventoryList.stream()

            .mapToInt(inventory ->
                    inventory.getQuantity() == null
                            ? 0
                            : inventory.getQuantity()
            )

            .min()

            .orElse(0);

}

    private InventoryResponse convertToResponse(
            Inventory inventory
    ) {

        InventoryResponse response =
                new InventoryResponse();

        response.setBatchId(
                inventory.getBatchId()
        );

        response.setMedicineId(
                inventory.getMedicine().getMedicineId()
        );

        response.setMedicineName(
                inventory.getMedicine().getName()
        );

        response.setCategory(
                inventory.getMedicine().getCategory()
        );

        response.setBatchNumber(
                inventory.getBatchNumber()
        );

        response.setQuantity(
                inventory.getQuantity()
        );

        response.setMedicinePrice(
                inventory.getMedicine().getPrice()
        );

        BigDecimal batchValue =
                inventory.getMedicine()
                        .getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        inventory.getQuantity()
                                )
                        );

        response.setBatchValue(
                batchValue
        );

        response.setMfgDate(
                inventory.getMfgDate()
        );

        response.setExpDate(
                inventory.getExpDate()
        );

        response.setStatus(
                determineStockStatus(inventory)
        );

        return response;

    }

    private StockStatus determineStockStatus(
            Inventory inventory
    ) {

        LocalDate today = LocalDate.now();

        if (inventory.getExpDate().isBefore(today)) {

            return StockStatus.EXPIRED;

        }

        if (!inventory.getExpDate().isAfter(
                today.plusDays(30)
        )) {

            return StockStatus.EXPIRING_SOON;

        }

        if (inventory.getQuantity() <= LOW_STOCK_THRESHOLD) {

            return StockStatus.LOW_STOCK;

        }

        return StockStatus.HEALTHY;

    }

}