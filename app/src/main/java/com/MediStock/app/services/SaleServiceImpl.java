package com.MediStock.app.services;

import com.MediStock.app.dto.SaleRequest;
import com.MediStock.app.dto.SaleResponse;
import com.MediStock.app.entities.ActivityLog;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Medicine;
import com.MediStock.app.entities.Sale;
import com.MediStock.app.entities.StockLog;
import com.MediStock.app.entities.User;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.repositories.ActivityLogRepository;
import com.MediStock.app.repositories.InventoryRepository;
import com.MediStock.app.repositories.SaleRepository;
import com.MediStock.app.repositories.StockLogRepository;
import com.MediStock.app.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final InventoryRepository inventoryRepository;
    private final StockLogRepository stockLogRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public SaleServiceImpl(
            SaleRepository saleRepository,
            InventoryRepository inventoryRepository,
            StockLogRepository stockLogRepository,
            ActivityLogRepository activityLogRepository,
            UserRepository userRepository
    ) {

        this.saleRepository = saleRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockLogRepository = stockLogRepository;
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;

    }


    /*
     * ============================================================
     * CREATE SALE
     * ============================================================
     */

    @Override
    @Transactional
    public SaleResponse createSale(
            SaleRequest request
    ) {

        /*
         * Validate request.
         */

        if (request == null) {

            throw new RuntimeException(
                    "Sale request cannot be empty."
            );

        }

        if (request.getBatchId() == null) {

            throw new RuntimeException(
                    "Batch ID is required."
            );

        }

        if (request.getUserId() == null) {

            throw new RuntimeException(
                    "User ID is required."
            );

        }

        if (
                request.getQuantity() == null
                ||
                request.getQuantity() <= 0
        ) {

            throw new RuntimeException(
                    "Sale quantity must be greater than zero."
            );

        }


        /*
         * Find inventory batch.
         */

        Inventory inventory =
                inventoryRepository
                        .findById(request.getBatchId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory batch not found."
                                )
                        );


        /*
         * Find user who is recording
         * the sale.
         */

        User user =
                userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        /*
         * Get medicine from inventory.
         */

        Medicine medicine =
                inventory.getMedicine();


        if (medicine == null) {

            throw new RuntimeException(
                    "Medicine associated with this batch was not found."
            );

        }


        /*
         * Get current inventory quantity.
         */

        int currentQuantity =
                inventory.getQuantity() == null
                        ? 0
                        : inventory.getQuantity();


        /*
         * Make sure the requested sale
         * does not exceed available stock.
         */

        if (
                request.getQuantity()
                >
                currentQuantity
        ) {

            throw new RuntimeException(
                    "Insufficient stock. Available quantity: "
                            + currentQuantity
            );

        }


        /*
         * Get the medicine's current price.
         *
         * We copy this price into the Sale
         * record so that historical sales
         * retain their original price even
         * if the medicine price changes later.
         */

        BigDecimal unitPrice =
                medicine.getPrice();


        if (unitPrice == null) {

            throw new RuntimeException(
                    "Medicine price is not available."
            );

        }


        /*
         * Calculate total sale amount.
         */

        BigDecimal totalAmount =
                unitPrice.multiply(
                        BigDecimal.valueOf(
                                request.getQuantity()
                        )
                );


        /*
         * ========================================================
         * CREATE SALE
         * ========================================================
         */

        Sale sale =
                new Sale();

        sale.setInventory(
                inventory
        );

        sale.setUser(
                user
        );

        sale.setCustomerName(
                request.getCustomerName()
        );

        sale.setQuantity(
                request.getQuantity()
        );

        sale.setUnitPrice(
                unitPrice
        );

        sale.setTotalAmount(
                totalAmount
        );

        sale.setSaleDate(
                LocalDateTime.now()
        );


        /*
         * Save the sale first.
         *
         * This generates the saleId which
         * will be used by the ActivityLog.
         */

        Sale savedSale =
                saleRepository.save(
                        sale
                );


        /*
         * ========================================================
         * UPDATE INVENTORY
         * ========================================================
         */

        int newQuantity =
                currentQuantity
                -
                request.getQuantity();

        inventory.setQuantity(
                newQuantity
        );

        inventoryRepository.save(
                inventory
        );


        /*
         * ========================================================
         * CREATE STOCK LOG
         * ========================================================
         *
         * A sale removes inventory.
         *
         * Example:
         *
         * Before: 50
         * Sold:    5
         * After:  45
         *
         * StockLog:
         *
         * actionTaken     = SALE
         * quantityChanged = -5
         */

        StockLog stockLog =
                new StockLog();

        stockLog.setBatchId(
                inventory.getBatchId()
        );

        stockLog.setUserId(
                user.getUserId()
        );

        stockLog.setActionTaken(
                "SALE"
        );

        stockLog.setQuantityChanged(
                -request.getQuantity()
        );

        stockLog.setLogDate(
                LocalDateTime.now()
        );

        stockLogRepository.save(
                stockLog
        );


        /*
         * ========================================================
         * CREATE ACTIVITY LOG
         * ========================================================
         */

        ActivityLog activityLog =
                new ActivityLog();

        activityLog.setModule(
                ActivityModule.SALES
        );

        activityLog.setAction(
                ActivityAction.CREATED
        );

        /*
         * The newly generated sale ID is used
         * as the activity reference.
         */

        activityLog.setReferenceId(
                savedSale.getSaleId()
        );

        /*
         * Medicine name is used as the
         * human-readable reference name.
         */

        activityLog.setReferenceName(
                medicine.getName()
        );


        /*
         * Create a readable activity description.
         */

        activityLog.setDescription(
                "Sale recorded: "
                        + request.getQuantity()
                        + " unit(s) of "
                        + medicine.getName()
                        + " from batch "
                        + inventory.getBatchNumber()
                        + " sold for ₹"
                        + totalAmount
        );


        /*
         * User information.
         */

        activityLog.setPerformedBy(
                user.getName()
        );

        activityLog.setUserRole(
                getRoleName(
                        user.getRoleId()
                )
        );

        activityLog.setPerformedAt(
                LocalDateTime.now()
        );


        activityLogRepository.save(
                activityLog
        );


        /*
         * ========================================================
         * RETURN RESPONSE
         * ========================================================
         */

        return mapToResponse(
                savedSale
        );

    }


    /*
     * ============================================================
     * GET ALL SALES
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> getAllSales() {

        return saleRepository
                .findAllByOrderBySaleDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }


    /*
     * ============================================================
     * GET SALE BY ID
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public SaleResponse getSaleById(
            Long saleId
    ) {

        Sale sale =
                saleRepository
                        .findById(saleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sale not found."
                                )
                        );

        return mapToResponse(
                sale
        );

    }


    /*
     * ============================================================
     * GET TOTAL SALES
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalSales() {

        BigDecimal total =
                saleRepository.getTotalSales();

        return total == null
                ? BigDecimal.ZERO
                : total;

    }


    /*
     * ============================================================
     * GET TOTAL TRANSACTIONS
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public Long getTotalTransactions() {

        return saleRepository.count();

    }


    /*
     * ============================================================
     * GET TOTAL UNITS SOLD
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public Long getTotalUnitsSold() {

        Long total =
                saleRepository.getTotalUnitsSold();

        return total == null
                ? 0L
                : total;

    }


    /*
     * ============================================================
     * GET SALES REVENUE BETWEEN DATES
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getSalesBetween(
            LocalDate startDate,
            LocalDate endDate
    ) {

        validateDateRange(
                startDate,
                endDate
        );

        LocalDateTime start =
                startDate.atStartOfDay();

        /*
         * We use the beginning of the day
         * AFTER endDate so the entire end
         * date is included.
         *
         * Example:
         *
         * 2026-08-16
         *
         * becomes:
         *
         * >= 2026-08-16 00:00
         * <  2026-08-17 00:00
         */

        LocalDateTime end =
                endDate
                        .plusDays(1)
                        .atStartOfDay();

        BigDecimal total =
                saleRepository.getTotalSalesBetween(
                        start,
                        end
                );

        return total == null
                ? BigDecimal.ZERO
                : total;

    }


    /*
     * ============================================================
     * GET SALES RECORDS BETWEEN DATES
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesBetweenDates(
            LocalDate startDate,
            LocalDate endDate
    ) {

        validateDateRange(
                startDate,
                endDate
        );

        LocalDateTime start =
                startDate.atStartOfDay();

        LocalDateTime end =
                endDate
                        .plusDays(1)
                        .atStartOfDay();

        return saleRepository
                .findBySaleDateBetweenOrderBySaleDateDesc(
                        start,
                        end
                )
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }


    /*
     * ============================================================
     * VALIDATE DATE RANGE
     * ============================================================
     */

    private void validateDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate == null) {

            throw new RuntimeException(
                    "Start date is required."
            );

        }

        if (endDate == null) {

            throw new RuntimeException(
                    "End date is required."
            );

        }

        if (startDate.isAfter(endDate)) {

            throw new RuntimeException(
                    "Start date cannot be after end date."
            );

        }

    }


    /*
     * ============================================================
     * CONVERT ROLE ID TO ROLE NAME
     * ============================================================
     *
     * Your current User entity stores roleId rather
     * than a Role entity.
     *
     * Your project currently uses:
     *
     * 1 = ADMIN
     * 2 = STAFF
     * 3 = PHARMACIST
     */

    private String getRoleName(
            Long roleId
    ) {

        if (roleId == null) {

            return "UNKNOWN";

        }

        switch (roleId.intValue()) {

            case 1:
                return "ADMIN";

            case 2:
                return "STAFF";

            case 3:
                return "PHARMACIST";

            default:
                return "UNKNOWN";

        }

    }


    /*
     * ============================================================
     * MAP SALE TO RESPONSE
     * ============================================================
     */

    private SaleResponse mapToResponse(
            Sale sale
    ) {

        SaleResponse response =
                new SaleResponse();


        /*
         * Sale information.
         */

        response.setSaleId(
                sale.getSaleId()
        );

        response.setCustomerName(
                sale.getCustomerName()
        );

        response.setQuantity(
                sale.getQuantity()
        );

        response.setUnitPrice(
                sale.getUnitPrice()
        );

        response.setTotalAmount(
                sale.getTotalAmount()
        );

        response.setSaleDate(
                sale.getSaleDate()
        );


        /*
         * Inventory information.
         */

        Inventory inventory =
                sale.getInventory();

        if (inventory != null) {

            response.setBatchId(
                    inventory.getBatchId()
            );

            response.setBatchNumber(
                    inventory.getBatchNumber()
            );


            /*
             * Medicine information.
             */

            Medicine medicine =
                    inventory.getMedicine();

            if (medicine != null) {

                response.setMedicineId(
                        medicine.getMedicineId()
                );

                response.setMedicineName(
                        medicine.getName()
                );

                response.setCategory(
                        medicine.getCategory()
                );

            }

        }


        /*
         * User information.
         */

        User user =
                sale.getUser();

        if (user != null) {

            response.setUserId(
                    user.getUserId()
            );

            response.setSoldBy(
                    user.getName()
            );

        }


        return response;

    }

}