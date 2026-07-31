package com.medistock.service;

import java.util.List;
import com.medistock.entity.Medicine;

public interface MedicineService {

    Medicine addMedicine(Medicine medicine);

    List<Medicine> getAllMedicines();

    List<Medicine> searchByBatchNumber(String batchNumber);

List<Medicine> searchByExpiryDate(String expiryDate);

List<Medicine> searchMedicine(String search);

    Medicine updateMedicine(Long id, Medicine medicine);

    void deleteMedicine(Long id);

    Medicine getMedicineById(Long id);

    long getTotalMedicines();

    long getInStockMedicines();

    long getLowStockMedicines();

    long getOutOfStockMedicines();

    long getExpiredMedicines();

long getNearExpiryMedicines();

}