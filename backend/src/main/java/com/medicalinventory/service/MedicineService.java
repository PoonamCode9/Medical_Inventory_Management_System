package com.medicalinventory.service;

import com.medicalinventory.entity.Medicine;

import java.util.List;
import java.util.Map;

public interface MedicineService {

    Medicine addMedicine(Medicine medicine);

    List<Medicine> getAllMedicines();

    Medicine getMedicineById(Long id);

    Medicine updateMedicine(Long id, Medicine medicine);

    void deleteMedicine(Long id);

    Long getMedicineCount();

    Medicine stockIn(Long medicineId, Integer quantity);

    Medicine stockOut(Long medicineId, Integer quantity);

    Map<String, Long> getMedicineStatusCounts();

    Map<String, Long> getMedicineCategoryCounts();
}