package com.medistock.backend.service;

import com.medistock.backend.dto.request.MedicineRequest;
import com.medistock.backend.dto.response.MedicineResponse;

import java.util.List;

public interface MedicineService {
    List<MedicineResponse> getAllMedicines();
    MedicineResponse getMedicineById(Integer id);
    MedicineResponse createMedicine(MedicineRequest request, String email);
    MedicineResponse updateMedicine(Integer id, MedicineRequest request, String email);
    void deleteMedicine(Integer id, String email);
}
