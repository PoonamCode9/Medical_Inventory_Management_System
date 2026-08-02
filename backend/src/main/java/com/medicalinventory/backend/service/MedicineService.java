package com.medicalinventory.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.medicalinventory.backend.entity.ExpiryTracking;
import com.medicalinventory.backend.entity.Medicine;
import com.medicalinventory.backend.entity.Supplier;
import com.medicalinventory.backend.repository.ExpiryTrackingRepository;
import com.medicalinventory.backend.repository.MedicineRepository;
import com.medicalinventory.backend.repository.SupplierRepository;

@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;
    private final NotificationService notificationService;
    private final ExpiryTrackingRepository expiryTrackingRepository;

    public MedicineService(MedicineRepository medicineRepository, SupplierRepository supplierRepository, NotificationService notificationService, ExpiryTrackingRepository expiryTrackingRepository) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
        this.notificationService = notificationService;
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    // Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // Get medicine by id
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // Add medicine (save)
    public Medicine saveMedicine(Medicine medicine) {
        if(medicineRepository.findByBatchNo(medicine.getBatchNo()).isPresent()) {
            throw new RuntimeException("Batch number already exists");
        }
        Supplier supplier = supplierRepository.findById(medicine.getSupplier().getSupplierId()).orElseThrow(() -> new RuntimeException("Supplier not found"));

        medicine.setSupplier(supplier);
        Medicine savedMedicine = medicineRepository.save(medicine);

        notificationService.createNotification(savedMedicine, "MEDICINE_ADDED",  savedMedicine.getMedicineName() + " medicine added successfully.", "Push");

        updateExpiryTracking(savedMedicine);

        return savedMedicine;
    }

    // Update medicine 
    public Medicine updateMedicine(Long id, Medicine medicine) {
        Medicine existingMedicine = medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));

        Supplier supplier = supplierRepository.findById(medicine.getSupplier().getSupplierId()).orElseThrow(() -> new RuntimeException("Supplier not found"));

        Optional<Medicine> batchMedicine = medicineRepository.findByBatchNo(medicine.getBatchNo());
        if(batchMedicine.isPresent() && !batchMedicine.get().getMedicineId().equals(id)) {
            throw new RuntimeException("Batch number already exists");
        }

        existingMedicine.setMedicineName(medicine.getMedicineName());
        existingMedicine.setCategory(medicine.getCategory());
        existingMedicine.setBatchNo(medicine.getBatchNo());
        existingMedicine.setManufactureDate(medicine.getManufactureDate());
        existingMedicine.setExpiryDate(medicine.getExpiryDate());
        existingMedicine.setPrice(medicine.getPrice());
        existingMedicine.setSupplier(supplier);

        Medicine updatedMedicine = medicineRepository.save(existingMedicine);

        notificationService.createNotification(updatedMedicine, "MEDICINE_UPDATED",  updatedMedicine.getMedicineName() + " medicine updated successfully.", "Push");

        updateExpiryTracking(updatedMedicine);

        return updatedMedicine;
    }

    // Delete medicine
    public void deleteMedicine(Long id) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));

        String medicineName = medicine.getMedicineName();

        medicineRepository.delete(medicine);

        notificationService.createNotification(
            null, 
            "MEDICINE_DELETED", 
            medicineName + " medicine deleted successfully.", 
            "Push"
        );
    }

    // find distinct categories
    public List<String> getCategories() {
        return medicineRepository.findDistinctCategories();
    }

    // count of each category
    public List<Map<String, Object>> getCategoryChart() {
        List<Object[]> result = medicineRepository.getCategoryWiseCount();
        List<Map<String, Object>> data = new ArrayList<>();
        
        for(Object[] row : result) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("value", row[1]);
            
            data.add(map);
        }
        return data;
    }

    private void updateExpiryTracking(Medicine medicine) {
        ExpiryTracking expiryTracking = expiryTrackingRepository.findByMedicine(medicine).orElse(new ExpiryTracking());
        expiryTracking.setMedicine(medicine);
        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), medicine.getExpiryDate());
        if(daysLeft < 0) {
            expiryTracking.setStatus("Expired");
            expiryTracking.setRemarks("Remove from inventory");
        } else if(daysLeft <= 7) {
            expiryTracking.setStatus("Urgent");
            expiryTracking.setRemarks("Sell first");
        } else if(daysLeft <= 30) {
            expiryTracking.setStatus("Expiring_Soon");
            expiryTracking.setRemarks("Monitor Stock");
        } else {
            expiryTracking.setStatus("Active");
            expiryTracking.setRemarks("No action required");
        }

        expiryTrackingRepository.save(expiryTracking);
    }
}
