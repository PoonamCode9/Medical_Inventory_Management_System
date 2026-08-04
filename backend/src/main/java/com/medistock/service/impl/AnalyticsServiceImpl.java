package com.medistock.service.impl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medistock.dto.AnalyticsResponse;
import com.medistock.repository.ExpiryTrackingRepository;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.service.AnalyticsService;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ExpiryTrackingRepository expiryTrackingRepository;

    @Override
    public AnalyticsResponse getAnalytics() {

        long totalMedicines = medicineRepository.count();

        long totalSuppliers = supplierRepository.count();

        long totalInventory = inventoryRepository.count();

        long lowStock = inventoryRepository.findAll()
        .stream()
        .filter(i -> i.getAvailableStock() <= i.getMinimumStock())
        .count();

        long expiringSoon = expiryTrackingRepository.findAll()
                .stream()
                .filter(e -> "Expiring Soon".equals(e.getStatus()))
                .count();

        long expired = expiryTrackingRepository.findAll()
                .stream()
                .filter(e -> "Expired".equals(e.getStatus()))
                .count();

        return new AnalyticsResponse(
                totalMedicines,
                totalSuppliers,
                totalInventory,
                lowStock,
                expiringSoon,
                expired);
    }
}