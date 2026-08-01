package com.medistock.service;

import com.medistock.entity.Medicine;
import com.medistock.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public Medicine addMedicine(Medicine medicine){
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines(){
        return medicineRepository.findAll();
    }

    public Medicine getMedicine(Long id){
        return medicineRepository.findById(id).orElse(null);
    }

    public Medicine updateMedicine(Long id, Medicine medicine){

        Medicine existing = medicineRepository.findById(id).orElse(null);

        if(existing == null){
            return null;
        }

        existing.setMedicineName(medicine.getMedicineName());
        existing.setCategory(medicine.getCategory());
        existing.setBatchNumber(medicine.getBatchNumber());
        existing.setQuantity(medicine.getQuantity());
        existing.setPrice(medicine.getPrice());
        existing.setManufacturingDate(medicine.getManufacturingDate());
        existing.setExpiryDate(medicine.getExpiryDate());

        return medicineRepository.save(existing);
    }

    public void deleteMedicine(Long id){
        medicineRepository.deleteById(id);
    }

    public List<Medicine> searchMedicine(String name){
        return medicineRepository.findByMedicineNameContainingIgnoreCase(name);
    }
    public List<Medicine> getLowStockMedicines() {
    return medicineRepository.findByQuantityLessThan(10);
    }

    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }
    public List<Medicine> getOutOfStockMedicines() {

    return medicineRepository.findByQuantity(0);

}
public List<Medicine> getNearExpiryMedicines() {

    LocalDate today = LocalDate.now();
    LocalDate next30Days = today.plusDays(30);

    return medicineRepository.findByExpiryDateBetween(today, next30Days);
}
public List<Medicine> getExpiredMedicines() {

    return medicineRepository.findByExpiryDateBefore(LocalDate.now());

}
}