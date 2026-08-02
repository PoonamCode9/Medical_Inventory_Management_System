package com.medicalinventory.service.impl;

import com.medicalinventory.entity.Medicine;
import com.medicalinventory.entity.StockLog;
import com.medicalinventory.entity.User;
import com.medicalinventory.entity.ExpiryTracking;
import com.medicalinventory.repository.MedicineRepository;
import com.medicalinventory.repository.StockLogRepository;
import com.medicalinventory.repository.UserRepository;
import com.medicalinventory.repository.ExpiryTrackingRepository;

import com.medicalinventory.service.MedicineService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;

import java.util.List;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final StockLogRepository stockLogRepository;
    private final UserRepository userRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;

    public MedicineServiceImpl(
            MedicineRepository medicineRepository,
            StockLogRepository stockLogRepository,
            UserRepository userRepository,
            ExpiryTrackingRepository expiryTrackingRepository) {

        this.medicineRepository = medicineRepository;
        this.stockLogRepository = stockLogRepository;
        this.userRepository = userRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
    }

    @Override
    public Medicine addMedicine(Medicine medicine) {

        if (medicineRepository.existsByBatchNo(medicine.getBatchNo())) {
            throw new RuntimeException("Batch number already exists");
        }

        // Save medicine first
        Medicine savedMedicine = medicineRepository.save(medicine);

        // Create expiry tracking record
        ExpiryTracking expiryTracking = new ExpiryTracking();

        expiryTracking.setMedicine(savedMedicine);
        expiryTracking.setExpiryDate(savedMedicine.getExpiryDate());
        expiryTracking.setQuantity(savedMedicine.getQuantity());
        expiryTracking.setStatus(
                calculateExpiryStatus(savedMedicine.getExpiryDate()));

        expiryTrackingRepository.save(expiryTracking);

        return savedMedicine;
    }

    private String calculateExpiryStatus(LocalDate expiryDate) {

        LocalDate today = LocalDate.now();
        LocalDate expiringSoonDate = today.plusDays(30);

        if (expiryDate.isBefore(today)) {
            return "EXPIRED";
        } else if (!expiryDate.isAfter(expiringSoonDate)) {
            return "EXPIRING_SOON";
        } else {
            return "VALID";
        }
    }

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    @Override
    public Medicine updateMedicine(Long id, Medicine medicine) {

        Medicine existingMedicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        existingMedicine.setMedicineName(medicine.getMedicineName());
        existingMedicine.setCategory(medicine.getCategory());
        existingMedicine.setManufacturer(medicine.getManufacturer());
        existingMedicine.setBatchNo(medicine.getBatchNo());
        existingMedicine.setExpiryDate(medicine.getExpiryDate());
        existingMedicine.setUnitPrice(medicine.getUnitPrice());
        existingMedicine.setQuantity(medicine.getQuantity());
        existingMedicine.setSupplier(medicine.getSupplier());

        // Save the updated medicine
        Medicine updatedMedicine = medicineRepository.save(existingMedicine);

        // Update expiry tracking
        ExpiryTracking expiryTracking = expiryTrackingRepository
                .findByMedicineMedicineId(id)
                .orElseThrow(() -> new RuntimeException("Expiry tracking not found"));

        expiryTracking.setExpiryDate(updatedMedicine.getExpiryDate());
        expiryTracking.setQuantity(updatedMedicine.getQuantity());
        expiryTracking.setStatus(calculateExpiryStatus(updatedMedicine.getExpiryDate()));

        expiryTrackingRepository.save(expiryTracking);

        return updatedMedicine;
    }

    @Transactional
    @Override
    public void deleteMedicine(Long id) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // Check whether this medicine has stock history
        if (stockLogRepository.existsByMedicineMedicineId(id)) {
            throw new RuntimeException(
                    "Cannot delete this medicine because stock history exists.");
        }

        // Delete expiry tracking record first
        expiryTrackingRepository.deleteByMedicineMedicineId(id);

        // Now delete the medicine
        medicineRepository.delete(medicine);

    }

    @Override
    public Long getMedicineCount() {
        return medicineRepository.count();
    }

    @Override
    public Medicine stockIn(Long medicineId, Integer quantity) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // Store quantity before stock update
        Integer oldQuantity = medicine.getQuantity();

        // Calculate new quantity
        Integer newQuantity = oldQuantity + quantity;

        // Update medicine quantity
        medicine.setQuantity(newQuantity);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockLog stockLog = new StockLog();

        stockLog.setMedicine(updatedMedicine);
        stockLog.setUser(user);
        stockLog.setAction("STOCK_IN");

        // Quantity added
        stockLog.setQuantity(quantity);

        // Quantity before stock in
        stockLog.setOldQuantity(oldQuantity);

        // Quantity after stock in
        stockLog.setNewQuantity(newQuantity);

        stockLog.setActionDate(LocalDateTime.now());
        stockLog.setRemarks("Stock added");

        stockLogRepository.save(stockLog);

        return updatedMedicine;
    }

    @Override
    public Medicine stockOut(Long medicineId, Integer quantity) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        // Store quantity before stock update
        Integer oldQuantity = medicine.getQuantity();

        // Check sufficient stock
        if (oldQuantity < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        // Calculate new quantity
        Integer newQuantity = oldQuantity - quantity;

        // Update medicine quantity
        medicine.setQuantity(newQuantity);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockLog stockLog = new StockLog();

        stockLog.setMedicine(updatedMedicine);
        stockLog.setUser(user);
        stockLog.setAction("STOCK_OUT");

        // Quantity removed
        stockLog.setQuantity(quantity);

        // Quantity before stock out
        stockLog.setOldQuantity(oldQuantity);

        // Quantity after stock out
        stockLog.setNewQuantity(newQuantity);

        stockLog.setActionDate(LocalDateTime.now());
        stockLog.setRemarks("Stock removed");

        stockLogRepository.save(stockLog);

        return updatedMedicine;
    }
}
