package com.medistock.backend.service.impl;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.DashboardDTO;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.NotificationRepository;
import com.medistock.backend.repository.PurchaseOrderRepository;
import com.medistock.backend.repository.SupplierRepository;
import com.medistock.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final MedicineRepository medicineRepository;

    private final SupplierRepository supplierRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final InventoryRepository inventoryRepository;

    private final NotificationRepository notificationRepository;

    @Override
    public DashboardDTO getAdminDashboard() {

        DashboardDTO dto = new DashboardDTO();

        dto.setTotalMedicines(medicineRepository.count());

        dto.setTotalSuppliers(supplierRepository.count());

        dto.setTotalPurchaseOrders(purchaseOrderRepository.count());

        dto.setTotalInventory(inventoryRepository.count());

        dto.setUnreadNotifications(notificationRepository.countByIsReadFalse());

        dto.setLowStock(medicineRepository.countByQuantityLessThanEqual(20));

        dto.setOutOfStock(medicineRepository.countByQuantity(0));

        dto.setExpiringSoon(
                medicineRepository.countByExpiryDateBetween(
                        LocalDate.now(),
                        LocalDate.now().plusDays(30)
                )
        );

        dto.setExpired(
                medicineRepository.countByExpiryDateBefore(
                        LocalDate.now()
                )
        );

        return dto;
    }

    @Override
    public DashboardDTO getInventoryDashboard() {

        DashboardDTO dto = new DashboardDTO();

        dto.setTotalInventory(inventoryRepository.count());

        dto.setLowStock(medicineRepository.countByQuantityLessThanEqual(20));

        dto.setOutOfStock(medicineRepository.countByQuantity(0));

        dto.setUnreadNotifications(notificationRepository.countByIsReadFalse());

        return dto;
    }

    @Override
    public DashboardDTO getPharmacistDashboard() {

        DashboardDTO dto = new DashboardDTO();

        dto.setTotalMedicines(medicineRepository.count());

        dto.setExpiringSoon(
                medicineRepository.countByExpiryDateBetween(
                        LocalDate.now(),
                        LocalDate.now().plusDays(30)
                )
        );

        dto.setExpired(
                medicineRepository.countByExpiryDateBefore(
                        LocalDate.now()
                )
        );

        dto.setUnreadNotifications(notificationRepository.countByIsReadFalse());

        return dto;
    }
}