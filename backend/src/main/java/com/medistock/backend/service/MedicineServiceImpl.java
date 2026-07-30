package com.medistock.backend.service;

import com.medistock.backend.dto.MedicineDTO;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.Category;
import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.Supplier;
import com.medistock.backend.repository.CategoryRepository;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(MedicineDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
    }

    @Override
    public MedicineDTO getMedicineDTOById(Long id) {
        return new MedicineDTO(getMedicineById(id));
    }

    @Override
    public List<MedicineDTO> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines().stream()
                .map(MedicineDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineDTO> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(query, query).stream()
                .map(MedicineDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineDTO createMedicine(MedicineDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));

        Medicine medicine = new Medicine(
                dto.getName(),
                dto.getGenericName(),
                category,
                supplier,
                dto.getDescription(),
                dto.getCostPrice(),
                dto.getSellingPrice(),
                dto.getStockQuantity() != null ? dto.getStockQuantity() : 0,
                dto.getMinStockAlert() != null ? dto.getMinStockAlert() : 10
        );

        Medicine saved = medicineRepository.save(medicine);
        auditLogService.logAction("CREATE_MEDICINE", "Created medicine: " + saved.getName());
        notificationService.checkLowStockAndCreateNotifications();
        return new MedicineDTO(saved);
    }

    @Override
    public MedicineDTO updateMedicine(Long id, MedicineDTO dto) {
        Medicine existing = getMedicineById(id);

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + dto.getSupplierId()));

        existing.setName(dto.getName());
        existing.setGenericName(dto.getGenericName());
        existing.setCategory(category);
        existing.setSupplier(supplier);
        existing.setDescription(dto.getDescription());
        existing.setCostPrice(dto.getCostPrice());
        existing.setSellingPrice(dto.getSellingPrice());
        existing.setMinStockAlert(dto.getMinStockAlert());
        if (dto.getStockQuantity() != null) {
            existing.setStockQuantity(dto.getStockQuantity());
        }

        Medicine saved = medicineRepository.save(existing);
        auditLogService.logAction("UPDATE_MEDICINE", "Updated medicine: " + saved.getName());
        notificationService.checkLowStockAndCreateNotifications();
        return new MedicineDTO(saved);
    }

    @Override
    public void deleteMedicine(Long id) {
        Medicine existing = getMedicineById(id);
        medicineRepository.delete(existing);
        auditLogService.logAction("DELETE_MEDICINE", "Deleted medicine: " + existing.getName());
    }
}
