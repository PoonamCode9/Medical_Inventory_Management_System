package com.medistock.service.impl;

import org.springframework.stereotype.Service;

import com.medistock.dto.AnalyticsResponse;
import com.medistock.repository.ExpiryTrackingRepository;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.service.AnalyticsService;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;

    public AnalyticsServiceImpl(
            MedicineRepository medicineRepository,
            SupplierRepository supplierRepository,
            InventoryRepository inventoryRepository,
            ExpiryTrackingRepository expiryTrackingRepository) {

        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    @Override
public AnalyticsResponse getDashboardAnalytics() {

    AnalyticsResponse response = new AnalyticsResponse();

    response.setTotalMedicines(medicineRepository.count());

    response.setTotalSuppliers(supplierRepository.count());

    response.setTotalInventory(inventoryRepository.count());

    response.setExpiredMedicines(
            expiryTrackingRepository.countByStatus("Expired"));

    response.setExpiringSoonMedicines(
            expiryTrackingRepository.countByStatus("Expiring Soon"));

    response.setLowStockMedicines(
            inventoryRepository.countByAvailableStockLessThan(10));

    return response;
}
}