package com.MediStock.app.services;

import com.MediStock.app.dto.MedicineRequest;
import com.MediStock.app.dto.MedicineResponse;

import java.util.List;

public interface MedicineService {

    List<MedicineResponse> getAllMedicines();

    MedicineResponse getMedicineById(Long medicineId);

    MedicineResponse addMedicine(MedicineRequest request);

    MedicineResponse updateMedicine(Long medicineId, MedicineRequest request);

    void deleteMedicine(Long medicineId);
}