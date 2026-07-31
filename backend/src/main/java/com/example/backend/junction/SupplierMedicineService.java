package com.example.backend.junction;

import com.example.backend.dto.MedicineSlimDto;
import com.example.backend.dto.SupplierSlimDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierMedicineService {

    private final SupplierMedicineJdbcRepository repo;

    public SupplierMedicineService(SupplierMedicineJdbcRepository repo) {
        this.repo = repo;
    }

    public List<SupplierSlimDto> getSuppliersForMedicine(Integer medicineId) {
        return repo.findSuppliersByMedicineId(medicineId);
    }

    public List<MedicineSlimDto> getMedicinesForSupplier(Integer supplierId) {
        return repo.findMedicinesBySupplierId(supplierId);
    }

    public List<Integer> getSupplierIdsForMedicine(Integer medicineId) {
        return repo.findSupplierIdsByMedicineId(medicineId);
    }

    @Transactional
    public void replaceSuppliersForMedicine(Integer medicineId, List<Integer> supplierIds) {
        repo.replaceSuppliersForMedicine(medicineId, supplierIds);
    }

    public List<Integer> getMedicineIdsForSupplier(Integer supplierId) {
        return repo.findMedicineIdsBySupplier(supplierId);
    }
}

