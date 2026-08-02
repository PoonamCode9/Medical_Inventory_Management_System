package com.medicalinventory.service;

import com.medicalinventory.entity.Medicine;

import java.util.List;

public interface MedicineService {

    Medicine addMedicine(Medicine medicine);

    List<Medicine> getAllMedicines();

    Medicine getMedicineById(Long id);

    Medicine updateMedicine(Long id, Medicine medicine);

    void deleteMedicine(Long id);

    Long getMedicineCount();

    Medicine stockIn(Long medicineId, Integer quantity);

    Medicine stockOut(Long medicineId, Integer quantity);
}