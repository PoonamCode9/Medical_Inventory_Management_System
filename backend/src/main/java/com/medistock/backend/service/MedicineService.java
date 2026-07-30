package com.medistock.backend.service;

import com.medistock.backend.dto.MedicineDTO;
import com.medistock.backend.model.Medicine;
import java.util.List;

public interface MedicineService {
    List<MedicineDTO> getAllMedicines();
    Medicine getMedicineById(Long id);
    MedicineDTO getMedicineDTOById(Long id);
    List<MedicineDTO> getLowStockMedicines();
    List<MedicineDTO> searchMedicines(String query);
    MedicineDTO createMedicine(MedicineDTO medicineDTO);
    MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO);
    void deleteMedicine(Long id);
}
