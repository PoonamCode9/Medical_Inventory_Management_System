package com.medistock.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medistock.backend.dto.MedicineRequestdto;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.InventoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.SupplierRepository;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final NotificationService notificationService;

    public MedicineService(
            MedicineRepository medicineRepository,
            SupplierRepository supplierRepository,
            InventoryRepository inventoryRepository,
            NotificationService notificationService) {

        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.notificationService = notificationService;
    }

    // Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // Add medicine
    public Medicine addMedicine(MedicineRequestdto dto) {

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Medicine medicine = new Medicine();

        medicine.setMedicineName(dto.getMedicineName());
        medicine.setBatchNumber(dto.getBatchNumber());
        medicine.setCategory(dto.getCategory());
        medicine.setSupplier(supplier);
        medicine.setQuantity(dto.getQuantity());
        medicine.setPrice(dto.getPrice());
        medicine.setManufacturingDate(dto.getManufacturingDate());
        medicine.setExpiryDate(dto.getExpiryDate());

       Medicine savedMedicine = medicineRepository.save(medicine);

notificationService.createNotification(
        1,
        savedMedicine.getMedicineName() + " added successfully.",
        "MEDICINE"
);

return savedMedicine;
    }

    public Medicine updateMedicine(Integer id, MedicineRequestdto dto) {

    Medicine medicine = medicineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medicine not found"));

    Supplier supplier = supplierRepository.findById(dto.getSupplierId())
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

    medicine.setMedicineName(dto.getMedicineName());
    medicine.setBatchNumber(dto.getBatchNumber());
    medicine.setCategory(dto.getCategory());
    medicine.setSupplier(supplier);
    medicine.setQuantity(dto.getQuantity());
    medicine.setPrice(dto.getPrice());
    medicine.setManufacturingDate(dto.getManufacturingDate());
    medicine.setExpiryDate(dto.getExpiryDate());

  Medicine updatedMedicine = medicineRepository.save(medicine);

notificationService.createNotification(
        1,
        updatedMedicine.getMedicineName() + " updated successfully.",
        "MEDICINE"
);

return updatedMedicine;
}
@Transactional
public void deleteMedicine(Integer id) {

    Medicine medicine = medicineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medicine not found"));

    notificationService.createNotification(
            1,
            medicine.getMedicineName() + " deleted.",
            "MEDICINE"
    );

    inventoryRepository.deleteInventoryByMedicineId(id);

    medicineRepository.deleteById(id);
}

}