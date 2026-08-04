package com.MediStock.app.services;

import com.MediStock.app.dto.MedicineRequest;
import com.MediStock.app.dto.MedicineResponse;
import com.MediStock.app.entities.Medicine;
import com.MediStock.app.entities.Supplier;
import com.MediStock.app.repositories.MedicineRepository;
import com.MediStock.app.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final SupplierRepository supplierRepository;

    public MedicineServiceImpl(MedicineRepository medicineRepository,
                               SupplierRepository supplierRepository) {
        this.medicineRepository = medicineRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<MedicineResponse> getAllMedicines() {

        return medicineRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineResponse getMedicineById(Long medicineId) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        return convertToResponse(medicine);
    }

    @Override
    public MedicineResponse addMedicine(MedicineRequest request) {

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Medicine medicine = new Medicine();

        medicine.setName(request.getName());
        medicine.setCategory(request.getCategory());
        medicine.setPrice(request.getPrice());
        medicine.setSupplier(supplier);

        Medicine savedMedicine = medicineRepository.save(medicine);

        return convertToResponse(savedMedicine);
    }

    @Override
    public MedicineResponse updateMedicine(Long medicineId, MedicineRequest request) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        medicine.setName(request.getName());
        medicine.setCategory(request.getCategory());
        medicine.setPrice(request.getPrice());
        medicine.setSupplier(supplier);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return convertToResponse(updatedMedicine);
    }

    @Override
    public void deleteMedicine(Long medicineId) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicineRepository.delete(medicine);
    }

    private MedicineResponse convertToResponse(Medicine medicine) {

        MedicineResponse response = new MedicineResponse();

        response.setMedicineId(medicine.getMedicineId());
        response.setName(medicine.getName());
        response.setCategory(medicine.getCategory());
        response.setPrice(medicine.getPrice());

        response.setSupplierId(medicine.getSupplier().getSupplierId());
        response.setSupplierName(medicine.getSupplier().getName());

        return response;
    }
}