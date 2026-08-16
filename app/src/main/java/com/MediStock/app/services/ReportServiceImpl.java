package com.MediStock.app.services;

import com.MediStock.app.constants.NotificationConstants;
import com.MediStock.app.dto.DashboardResponse;
import com.MediStock.app.dto.DashboardSummaryResponse;
import com.MediStock.app.dto.InventoryAnalyticsResponse;
import com.MediStock.app.dto.MedicineAnalyticsResponse;
import com.MediStock.app.dto.NotificationAnalyticsResponse;
import com.MediStock.app.dto.PurchaseAnalyticsResponse;
import com.MediStock.app.dto.SaleResponse;
import com.MediStock.app.dto.SalesAnalyticsResponse;
import com.MediStock.app.dto.SupplierAnalyticsResponse;
import com.MediStock.app.dto.UserAnalyticsResponse;
import com.MediStock.app.entities.Inventory;
import com.MediStock.app.entities.Medicine;
import com.MediStock.app.entities.Sale;
import com.MediStock.app.enums.NotificationStatus;
import com.MediStock.app.enums.PurchaseOrderStatus;
import com.MediStock.app.repositories.InventoryRepository;
import com.MediStock.app.repositories.MedicineRepository;
import com.MediStock.app.repositories.NotificationRepository;
import com.MediStock.app.repositories.PurchaseOrderRepository;
import com.MediStock.app.repositories.SaleRepository;
import com.MediStock.app.repositories.SupplierRepository;
import com.MediStock.app.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    /*
     |--------------------------------------------------------------------------
     | Repositories
     |--------------------------------------------------------------------------
     */

    private final MedicineRepository medicineRepository;

    private final SupplierRepository supplierRepository;

    private final InventoryRepository inventoryRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    private final SaleRepository saleRepository;


    /*
     |--------------------------------------------------------------------------
     | Existing Services
     |--------------------------------------------------------------------------
     */

    private final MedicineService medicineService;

    private final InventoryService inventoryService;

    private final SupplierService supplierService;

    private final PurchaseOrderService purchaseOrderService;

    private final NotificationService notificationService;

    private final UserService userService;

    private final ActivityLogService activityLogService;


    /*
     |--------------------------------------------------------------------------
     | Constructor
     |--------------------------------------------------------------------------
     */

    public ReportServiceImpl(

            MedicineRepository medicineRepository,

            SupplierRepository supplierRepository,

            InventoryRepository inventoryRepository,

            PurchaseOrderRepository purchaseOrderRepository,

            NotificationRepository notificationRepository,

            UserRepository userRepository,

            SaleRepository saleRepository,

            MedicineService medicineService,

            InventoryService inventoryService,

            SupplierService supplierService,

            PurchaseOrderService purchaseOrderService,

            NotificationService notificationService,

            UserService userService,

            ActivityLogService activityLogService

    ) {

        this.medicineRepository =
                medicineRepository;

        this.supplierRepository =
                supplierRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.purchaseOrderRepository =
                purchaseOrderRepository;

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;

        this.saleRepository =
                saleRepository;

        this.medicineService =
                medicineService;

        this.inventoryService =
                inventoryService;

        this.supplierService =
                supplierService;

        this.purchaseOrderService =
                purchaseOrderService;

        this.notificationService =
                notificationService;

        this.userService =
                userService;

        this.activityLogService =
                activityLogService;

    }


    /*
     |--------------------------------------------------------------------------
     | Build Complete Dashboard Report
     |--------------------------------------------------------------------------
     */

    @Override
    public DashboardResponse getDashboardReport() {

        DashboardResponse dashboard =
                new DashboardResponse();


        /*
         * Summary cards.
         */

        dashboard.setSummary(
                buildSummary()
        );


        /*
         * Analytics.
         */

        dashboard.setMedicines(
                buildMedicineAnalytics()
        );

        dashboard.setInventory(
                buildInventoryAnalytics()
        );

        dashboard.setSuppliers(
                buildSupplierAnalytics()
        );

        dashboard.setPurchaseOrders(
                buildPurchaseAnalytics()
        );

        dashboard.setNotifications(
                buildNotificationAnalytics()
        );

        dashboard.setUsers(
                buildUserAnalytics()
        );

        dashboard.setSales(
                buildSalesAnalytics()
        );


        /*
         |--------------------------------------------------------------------------
         | Detailed Database Records
         |--------------------------------------------------------------------------
         */

        dashboard.setMedicineRecords(
                medicineService.getAllMedicines()
        );

        dashboard.setInventoryRecords(
                inventoryService.getAllInventory()
        );

        dashboard.setSupplierRecords(
                supplierService.getAllSuppliers()
        );

        dashboard.setPurchaseOrderRecords(
                purchaseOrderService.getAllPurchaseOrders()
        );

        dashboard.setNotificationRecords(
                notificationService.getAllNotifications()
        );

        dashboard.setUserRecords(
                userService.getAllUsers()
        );


        /*
         * Detailed sales records.
         *
         * These are ordered from newest sale
         * to oldest sale.
         */

        dashboard.setSalesRecords(

                saleRepository
                        .findAllByOrderBySaleDateDesc()
                        .stream()
                        .map(this::mapSaleToResponse)
                        .collect(Collectors.toList())

        );


        /*
         |--------------------------------------------------------------------------
         | Activity / Audit History
         |--------------------------------------------------------------------------
         */

        dashboard.setActivityLogs(
                activityLogService.getAllActivities()
        );


        return dashboard;

    }


    /*
     |--------------------------------------------------------------------------
     | Dashboard Summary
     |--------------------------------------------------------------------------
     */

    private DashboardSummaryResponse buildSummary() {

        DashboardSummaryResponse summary =
                new DashboardSummaryResponse();


        summary.setTotalMedicines(
                medicineRepository.count()
        );


        summary.setTotalSuppliers(
                supplierRepository.count()
        );


        summary.setTotalInventoryBatches(
                inventoryRepository.count()
        );


        summary.setTotalPurchaseOrders(
                purchaseOrderRepository.count()
        );


        summary.setTotalUsers(
                userRepository.count()
        );


        summary.setTotalNotifications(
                notificationRepository.count()
        );


        return summary;

    }


    /*
     |--------------------------------------------------------------------------
     | Medicine Analytics
     |--------------------------------------------------------------------------
     */

    private MedicineAnalyticsResponse buildMedicineAnalytics() {

        MedicineAnalyticsResponse response =
                new MedicineAnalyticsResponse();


        List<Medicine> medicines =
                medicineRepository.findAll();


        Set<String> categories =
                new HashSet<>();


        BigDecimal totalPrice =
                BigDecimal.ZERO;


        BigDecimal highestPrice =
                BigDecimal.ZERO;


        BigDecimal lowestPrice =
                BigDecimal.ZERO;


        boolean firstMedicine =
                true;


        for (
                Medicine medicine :
                medicines
        ) {

            BigDecimal price =
                    medicine.getPrice();


            if (price == null) {

                price =
                        BigDecimal.ZERO;

            }


            totalPrice =
                    totalPrice.add(price);


            if (
                    medicine.getCategory() != null
            ) {

                categories.add(
                        medicine.getCategory()
                );

            }


            if (firstMedicine) {

                highestPrice =
                        price;

                lowestPrice =
                        price;

                firstMedicine =
                        false;

            }

            else {

                if (
                        price.compareTo(
                                highestPrice
                        ) > 0
                ) {

                    highestPrice =
                            price;

                }


                if (
                        price.compareTo(
                                lowestPrice
                        ) < 0
                ) {

                    lowestPrice =
                            price;

                }

            }

        }


        response.setTotalMedicines(
                (long) medicines.size()
        );


        response.setTotalCategories(
                (long) categories.size()
        );


        if (
                medicines.isEmpty()
        ) {

            response.setAveragePrice(
                    BigDecimal.ZERO
            );

        }

        else {

            response.setAveragePrice(

                    totalPrice.divide(

                            BigDecimal.valueOf(
                                    medicines.size()
                            ),

                            2,

                            RoundingMode.HALF_UP

                    )

            );

        }


        response.setHighestPrice(
                highestPrice
        );


        response.setLowestPrice(
                lowestPrice
        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | Inventory Analytics
     |--------------------------------------------------------------------------
     */

    private InventoryAnalyticsResponse buildInventoryAnalytics() {

        InventoryAnalyticsResponse response =
                new InventoryAnalyticsResponse();


        List<Inventory> inventoryList =
                inventoryRepository.findAll();


        long totalQuantity =
                0;


        BigDecimal totalValue =
                BigDecimal.ZERO;


        long healthy =
                0;


        long lowStock =
                0;


        long expiringSoon =
                0;


        long expired =
                0;


        LocalDate today =
                LocalDate.now();


        for (
                Inventory inventory :
                inventoryList
        ) {

            Integer quantity =
                    inventory.getQuantity();


            if (quantity == null) {

                quantity =
                        0;

            }


            totalQuantity +=
                    quantity;


            BigDecimal medicinePrice =
                    inventory
                            .getMedicine()
                            .getPrice();


            if (medicinePrice == null) {

                medicinePrice =
                        BigDecimal.ZERO;

            }


            BigDecimal batchValue =
                    medicinePrice.multiply(
                            BigDecimal.valueOf(
                                    quantity
                            )
                    );


            totalValue =
                    totalValue.add(
                            batchValue
                    );


            /*
             * Expired has highest priority.
             */

            if (
                    inventory.getExpDate()
                            .isBefore(today)
            ) {

                expired++;

            }


            /*
             * Expiring soon.
             */

            else if (
                    !inventory
                            .getExpDate()
                            .isAfter(
                                    today.plusDays(
                                            NotificationConstants
                                                    .EXPIRY_WARNING_DAYS
                                    )
                            )
            ) {

                expiringSoon++;

            }


            /*
             * Low stock.
             */

            else if (
                    quantity
                            <=
                            NotificationConstants
                                    .LOW_STOCK_THRESHOLD
            ) {

                lowStock++;

            }


            /*
             * Healthy.
             */

            else {

                healthy++;

            }

        }


        response.setTotalInventoryBatches(
                (long) inventoryList.size()
        );


        response.setTotalStockQuantity(
                totalQuantity
        );


        response.setTotalInventoryValue(
                totalValue
        );


        response.setHealthyStock(
                healthy
        );


        response.setLowStock(
                lowStock
        );


        response.setExpiringSoon(
                expiringSoon
        );


        response.setExpiredStock(
                expired
        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | Supplier Analytics
     |--------------------------------------------------------------------------
     */

    private SupplierAnalyticsResponse buildSupplierAnalytics() {

        SupplierAnalyticsResponse response =
                new SupplierAnalyticsResponse();


        List<Medicine> medicines =
                medicineRepository.findAll();


        Set<Long> activeSuppliers =
                new HashSet<>();


        for (
                Medicine medicine :
                medicines
        ) {

            if (
                    medicine.getSupplier() != null
            ) {

                activeSuppliers.add(
                        medicine
                                .getSupplier()
                                .getSupplierId()
                );

            }

        }


        long totalSuppliers =
                supplierRepository.count();


        response.setTotalSuppliers(
                totalSuppliers
        );


        response.setActiveSuppliers(
                (long) activeSuppliers.size()
        );


        response.setInactiveSuppliers(
                Math.max(
                        0,
                        totalSuppliers
                                - activeSuppliers.size()
                )
        );


        response.setTotalMedicinesSupplied(
                (long) medicines.size()
        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | Purchase Order Analytics
     |--------------------------------------------------------------------------
     */

    private PurchaseAnalyticsResponse buildPurchaseAnalytics() {

        PurchaseAnalyticsResponse response =
                new PurchaseAnalyticsResponse();


        response.setTotalPurchaseOrders(
                purchaseOrderRepository.count()
        );


        response.setPendingOrders(

                (long)

                purchaseOrderRepository
                        .findByStatus(
                                PurchaseOrderStatus.PENDING
                        )
                        .size()

        );


        response.setApprovedOrders(

                (long)

                purchaseOrderRepository
                        .findByStatus(
                                PurchaseOrderStatus.APPROVED
                        )
                        .size()

        );


        response.setDeliveredOrders(

                (long)

                purchaseOrderRepository
                        .findByStatus(
                                PurchaseOrderStatus.DELIVERED
                        )
                        .size()

        );


        response.setCancelledOrders(

                (long)

                purchaseOrderRepository
                        .findByStatus(
                                PurchaseOrderStatus.CANCELLED
                        )
                        .size()

        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | Notification Analytics
     |--------------------------------------------------------------------------
     */

    private NotificationAnalyticsResponse buildNotificationAnalytics() {

        NotificationAnalyticsResponse response =
                new NotificationAnalyticsResponse();


        response.setTotalNotifications(
                notificationRepository.count()
        );


        response.setActiveNotifications(

                (long)

                notificationRepository
                        .findByStatusOrderByCreatedDateDesc(
                                NotificationStatus.ACTIVE
                        )
                        .size()

        );


        response.setReviewedNotifications(

                (long)

                notificationRepository
                        .findByStatusOrderByCreatedDateDesc(
                                NotificationStatus.REVIEWED
                        )
                        .size()

        );


        response.setResolvedNotifications(

                (long)

                notificationRepository
                        .findByStatusOrderByCreatedDateDesc(
                                NotificationStatus.RESOLVED
                        )
                        .size()

        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | User Analytics
     |--------------------------------------------------------------------------
     */

    private UserAnalyticsResponse buildUserAnalytics() {

        UserAnalyticsResponse response =
                new UserAnalyticsResponse();


        response.setTotalUsers(
                userRepository.count()
        );


        response.setAdminUsers(

                (long)

                userRepository
                        .findByRoleId(1L)
                        .size()

        );


        response.setPharmacistUsers(

                (long)

                userRepository
                        .findByRoleId(3L)
                        .size()

        );


        response.setStaffUsers(

                (long)

                userRepository
                        .findByRoleId(2L)
                        .size()

        );


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | Sales Analytics
     |--------------------------------------------------------------------------
     */

    private SalesAnalyticsResponse buildSalesAnalytics() {

        SalesAnalyticsResponse response =
                new SalesAnalyticsResponse();


        /*
         * Total number of sale transactions.
         */

        response.setTotalSales(
                saleRepository.count()
        );


        /*
         * Total number of medicine units sold.
         */

        Long totalUnitsSold =
                saleRepository.getTotalUnitsSold();


        response.setTotalUnitsSold(

                totalUnitsSold == null
                        ? 0L
                        : totalUnitsSold

        );


        /*
         * Total revenue.
         */

        BigDecimal totalRevenue =
                saleRepository.getTotalSales();


        if (
                totalRevenue == null
        ) {

            totalRevenue =
                    BigDecimal.ZERO;

        }


        response.setTotalRevenue(
                totalRevenue
        );


        /*
         * Average sale value.
         */

        long totalTransactions =
                saleRepository.count();


        if (
                totalTransactions == 0
        ) {

            response.setAverageSaleValue(
                    BigDecimal.ZERO
            );

        }

        else {

            response.setAverageSaleValue(

                    totalRevenue.divide(

                            BigDecimal.valueOf(
                                    totalTransactions
                            ),

                            2,

                            RoundingMode.HALF_UP

                    )

            );

        }


        return response;

    }


    /*
     |--------------------------------------------------------------------------
     | SALES REPORTS
     |--------------------------------------------------------------------------
     */


    /*
     * Total revenue from all recorded sales.
     */

    @Override
    public BigDecimal getTotalSales() {

        BigDecimal total =
                saleRepository.getTotalSales();


        return total == null
                ? BigDecimal.ZERO
                : total;

    }


    /*
     * Total number of sales transactions.
     */

    @Override
    public Long getTotalTransactions() {

        return saleRepository.count();

    }


    /*
     * Total number of medicine units sold.
     */

    @Override
    public Long getTotalUnitsSold() {

        Long total =
                saleRepository.getTotalUnitsSold();


        return total == null
                ? 0L
                : total;

    }


    /*
     * Total revenue between two dates.
     */

    @Override
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
         * Add one day to the end date so
         * the entire selected end date is
         * included.
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
     * Detailed sales records between two dates.
     */

    @Override
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
                .map(this::mapSaleToResponse)
                .collect(Collectors.toList());

    }


    /*
     |--------------------------------------------------------------------------
     | Validate Sales Report Date Range
     |--------------------------------------------------------------------------
     */

    private void validateDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (
                startDate == null
        ) {

            throw new RuntimeException(
                    "Start date is required."
            );

        }


        if (
                endDate == null
        ) {

            throw new RuntimeException(
                    "End date is required."
            );

        }


        if (
                startDate.isAfter(
                        endDate
                )
        ) {

            throw new RuntimeException(
                    "Start date cannot be after end date."
            );

        }

    }


    /*
     |--------------------------------------------------------------------------
     | Map Sale Entity To Sale Response
     |--------------------------------------------------------------------------
     */

    private SaleResponse mapSaleToResponse(
            Sale sale
    ) {

        SaleResponse response =
                new SaleResponse();


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


        if (
                inventory != null
        ) {

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


            if (
                    medicine != null
            ) {

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

        if (
                sale.getUser() != null
        ) {

            response.setUserId(
                    sale.getUser().getUserId()
            );


            response.setSoldBy(
                    sale.getUser().getName()
            );

        }


        return response;

    }

}