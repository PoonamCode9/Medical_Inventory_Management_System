package com.medistock.service;

import com.medistock.entity.Medicine;
import com.medistock.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryHistoryService historyService;

    // ===========================
    // Add Medicine
    // ===========================
    public Medicine addMedicine(Medicine medicine) {

        Medicine savedMedicine = medicineRepository.save(medicine);

        historyService.saveHistory(
                savedMedicine.getMedicineName(),
                "Added",
                savedMedicine.getQuantity()
        );

        return savedMedicine;
    }

    // ===========================
    // Get All Medicines
    // ===========================
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // ===========================
    // Get Medicine By Id
    // ===========================
    public Medicine getMedicine(Long id) {
        return medicineRepository.findById(id).orElse(null);
    }

    // ===========================
    // Update Medicine
    // ===========================
    public Medicine updateMedicine(Long id, Medicine medicine) {

        Medicine existing = medicineRepository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setMedicineName(medicine.getMedicineName());
        existing.setCategory(medicine.getCategory());
        existing.setBatchNumber(medicine.getBatchNumber());
        existing.setQuantity(medicine.getQuantity());
        existing.setPrice(medicine.getPrice());
        existing.setManufacturingDate(medicine.getManufacturingDate());
        existing.setExpiryDate(medicine.getExpiryDate());

        Medicine updatedMedicine = medicineRepository.save(existing);

        historyService.saveHistory(
                updatedMedicine.getMedicineName(),
                "Updated",
                updatedMedicine.getQuantity()
        );

        return updatedMedicine;
    }

    // ===========================
    // Delete Medicine
    // ===========================
    public void deleteMedicine(Long id) {

        Medicine medicine = medicineRepository.findById(id).orElse(null);

        if (medicine != null) {

            historyService.saveHistory(
                    medicine.getMedicineName(),
                    "Deleted",
                    medicine.getQuantity()
            );

            medicineRepository.deleteById(id);
        }
    }

    // ===========================
    // Search By Name
    // ===========================
    public List<Medicine> searchMedicine(String name) {
        return medicineRepository.findByMedicineNameContainingIgnoreCase(name);
    }

    // ===========================
    // Low Stock
    // ===========================
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findByQuantityLessThan(10);
    }

    // ===========================
    // Out Of Stock
    // ===========================
    public List<Medicine> getOutOfStockMedicines() {
        return medicineRepository.findByQuantity(0);
    }

    // ===========================
    // Near Expiry
    // ===========================
    public List<Medicine> getNearExpiryMedicines() {

        LocalDate today = LocalDate.now();
        LocalDate next30Days = today.plusDays(30);

        return medicineRepository.findByExpiryDateBetween(today, next30Days);
    }

    // ===========================
    // Expired Medicines
    // ===========================
    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }

    // ===========================
    // Search By Category
    // ===========================
    public List<Medicine> searchByCategory(String category) {
        return medicineRepository.findByCategoryContainingIgnoreCase(category);
    }

    // ===========================
    // Search By Batch
    // ===========================
    public List<Medicine> searchByBatch(String batch) {
        return medicineRepository.findByBatchNumberContainingIgnoreCase(batch);
    }

    // ===========================
    // Search By Expiry Date
    // ===========================
    public List<Medicine> searchByExpiry(LocalDate expiryDate) {
        return medicineRepository.findByExpiryDate(expiryDate);
    }

}