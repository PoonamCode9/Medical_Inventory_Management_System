package com.medistock.backend.service;

import com.medistock.backend.dto.MedicineRequest;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.StockLog;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.StockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StockLogRepository stockLogRepository;

    public Medicine addMedicine(MedicineRequest request) {
        Medicine medicine = new Medicine();
        medicine.setName(request.getName());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setCategory(request.getCategory());
        medicine.setSupplier(request.getSupplier());
        medicine.setQuantity(request.getQuantity());
        medicine.setManufacturingDate(request.getManufacturingDate());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setPrice(request.getPrice());
        medicine.setStatus(getStatus(request.getQuantity()));
        Medicine saved = medicineRepository.save(medicine);

        // Log the action
        StockLog log = new StockLog();
        log.setMedicineId(saved.getId());
        log.setMedicineName(saved.getName());
        log.setActionType("ADDED");
        log.setQuantityChanged(saved.getQuantity());
        log.setPreviousQuantity(0);
        log.setNewQuantity(saved.getQuantity());
        log.setPerformedBy("System");
        stockLogRepository.save(log);

        return saved;
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> 
                    new RuntimeException("Medicine not found!"));
    }

    public Medicine updateMedicine(Long id, MedicineRequest request) {
        Medicine medicine = getMedicineById(id);
        int previousQty = medicine.getQuantity();
        
        medicine.setName(request.getName());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setCategory(request.getCategory());
        medicine.setSupplier(request.getSupplier());
        medicine.setQuantity(request.getQuantity());
        medicine.setManufacturingDate(request.getManufacturingDate());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setPrice(request.getPrice());
        medicine.setStatus(getStatus(request.getQuantity()));
        Medicine updated = medicineRepository.save(medicine);

        // Log the action
        StockLog log = new StockLog();
        log.setMedicineId(updated.getId());
        log.setMedicineName(updated.getName());
        log.setActionType("UPDATED");
        log.setQuantityChanged(
            updated.getQuantity() - previousQty);
        log.setPreviousQuantity(previousQty);
        log.setNewQuantity(updated.getQuantity());
        log.setPerformedBy("System");
        stockLogRepository.save(log);

        return updated;
    }

    /*public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);

        // Log before delete
        StockLog log = new StockLog();
        log.setMedicineId(medicine.getId());
        log.setMedicineName(medicine.getName());
        log.setActionType("DELETED");
        log.setQuantityChanged(medicine.getQuantity());
        log.setPreviousQuantity(medicine.getQuantity());
        log.setNewQuantity(0);
        log.setPerformedBy("System");
        stockLogRepository.save(log);

        medicineRepository.deleteById(id);
    }*/


    public void deleteMedicine(Long id) {

    // Check if medicine exists
    getMedicineById(id);

    // Delete all stock logs related to this medicine
    stockLogRepository.deleteByMedicineId(id);

    // Delete the medicine
    medicineRepository.deleteById(id);
}

    public List<Medicine> searchByName(String name) {
        return medicineRepository
            .findByNameContainingIgnoreCase(name);
    }

    public List<Medicine> getByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }

    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findByQuantityLessThan(10);
    }

    public List<Medicine> getExpiringMedicines() {
    LocalDate today = LocalDate.now();
    LocalDate thirtyDaysLater = today.plusDays(30);
    return medicineRepository.findAll().stream()
            .filter(m -> m.getExpiryDate() != null &&
                    !m.getExpiryDate().isBefore(today) &&
                    m.getExpiryDate().isBefore(thirtyDaysLater))
            .collect(java.util.stream.Collectors.toList());
    }

    private String getStatus(Integer quantity) {
        if (quantity == 0) return "OUT_OF_STOCK";
        if (quantity < 10) return "LOW_STOCK";
        return "IN_STOCK";
    }
}