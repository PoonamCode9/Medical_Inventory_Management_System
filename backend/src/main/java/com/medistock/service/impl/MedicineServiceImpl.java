package com.medistock.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.entity.Medicine;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockLogRepository;
import com.medistock.service.MedicineService;

import com.medistock.entity.StockLog;
import java.time.LocalDate;

@Service
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
private final StockLogRepository stockLogRepository;

public MedicineServiceImpl(MedicineRepository medicineRepository,
                           StockLogRepository stockLogRepository) {

    this.medicineRepository = medicineRepository;
    this.stockLogRepository = stockLogRepository;

}

   @Override
public Medicine addMedicine(Medicine medicine) {

    Medicine savedMedicine = medicineRepository.save(medicine);

    StockLog log = new StockLog();

    log.setAction("Medicine Added");
    log.setQuantity(savedMedicine.getQuantity());
    log.setDate(LocalDate.now().toString());
    log.setMedicine(savedMedicine);

    stockLogRepository.save(log);

    return savedMedicine;

}

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id).orElse(null);
    }

    @Override
    public Medicine updateMedicine(Long id, Medicine medicine) {

        Medicine existing = medicineRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setMedicineName(medicine.getMedicineName());
existing.setManufacturer(medicine.getManufacturer());
existing.setCategory(medicine.getCategory());
existing.setBatchNumber(medicine.getBatchNumber());
existing.setManufacturingDate(medicine.getManufacturingDate());
existing.setExpiryDate(medicine.getExpiryDate());
existing.setSupplier(medicine.getSupplier());
existing.setPrice(medicine.getPrice());
existing.setQuantity(medicine.getQuantity());

           Medicine updatedMedicine = medicineRepository.save(existing);

StockLog log = new StockLog();

log.setAction("Medicine Updated");
log.setQuantity(updatedMedicine.getQuantity());
log.setDate(LocalDate.now().toString());
log.setMedicine(updatedMedicine);

stockLogRepository.save(log);

return updatedMedicine;
        }

        return null;
    }

    @Override
public void deleteMedicine(Long id) {

    Medicine medicine = medicineRepository.findById(id).orElse(null);

    if(medicine!=null){

        StockLog log = new StockLog();

        log.setAction("Medicine Deleted");
        log.setQuantity(medicine.getQuantity());
        log.setDate(LocalDate.now().toString());
        log.setMedicine(medicine);

        stockLogRepository.save(log);

        medicineRepository.delete(medicine);

    }

}
    @Override
public long getTotalMedicines() {

    return medicineRepository.count();

}

@Override
public long getInStockMedicines() {

    return medicineRepository.findAll()
            .stream()
            .filter(m -> m.getQuantity() > 20)
            .count();

}

@Override
public long getLowStockMedicines() {

    return medicineRepository.findAll()
            .stream()
            .filter(m -> m.getQuantity() > 0 && m.getQuantity() <= 20)
            .count();

}

@Override
public long getOutOfStockMedicines() {

    return medicineRepository.findAll()
            .stream()
            .filter(m -> m.getQuantity() == 0)
            .count();

}

@Override
public long getExpiredMedicines() {

    return medicineRepository.findAll()
            .stream()
            .filter(m -> m.getExpiryDate().compareTo(java.time.LocalDate.now().toString()) < 0)
            .count();

}

@Override
public long getNearExpiryMedicines() {

    java.time.LocalDate today = java.time.LocalDate.now();

    java.time.LocalDate next30 = today.plusDays(30);

    return medicineRepository.findAll()
            .stream()
            .filter(m -> {

                java.time.LocalDate expiry = java.time.LocalDate.parse(m.getExpiryDate());

                return expiry.isAfter(today.minusDays(1))
                        && expiry.isBefore(next30.plusDays(1));

            })
            .count();

}

@Override
public List<Medicine> searchByBatchNumber(String batchNumber) {
    return medicineRepository.findByBatchNumberContainingIgnoreCase(batchNumber);
}

@Override
public List<Medicine> searchByExpiryDate(String expiryDate) {
    return medicineRepository.findByExpiryDate(expiryDate);
}

@Override
public List<Medicine> searchMedicine(String search) {

    return medicineRepository.findByMedicineNameContainingIgnoreCase(search);

}

}