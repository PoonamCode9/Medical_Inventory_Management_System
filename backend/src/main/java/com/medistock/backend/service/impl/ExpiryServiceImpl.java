package com.medistock.backend.service.impl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.ExpiryDTO;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.service.ExpiryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpiryServiceImpl implements ExpiryService {

    private final MedicineRepository medicineRepository;

    @Override
public List<ExpiryDTO> getAllExpiryMedicines() {

    return medicineRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

    @Override
    public List<ExpiryDTO> getExpiringSoon() {

        List<Medicine> medicines = medicineRepository.findByExpiryDateBetween(
                LocalDate.now(),
                LocalDate.now().plusDays(30));

        return medicines.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpiryDTO> getExpiredMedicines() {

        List<Medicine> medicines =
                medicineRepository.findByExpiryDateBefore(LocalDate.now());

        return medicines.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ExpiryDTO convertToDTO(Medicine medicine) {

        ExpiryDTO dto = new ExpiryDTO();

        dto.setMedicineId(medicine.getMedicineId());
        dto.setMedicineName(medicine.getMedicineName());
        dto.setBatchNumber(medicine.getBatchNumber());
        dto.setCategory(medicine.getCategory());
        dto.setQuantity(medicine.getQuantity());
        dto.setExpiryDate(medicine.getExpiryDate());

        long days = ChronoUnit.DAYS.between(
                LocalDate.now(),
                medicine.getExpiryDate());

        dto.setDaysRemaining(days);

        if (days < 0) {
            dto.setStatus("EXPIRED");
        } else if (days <= 30) {
            dto.setStatus("EXPIRING_SOON");
        } else {
            dto.setStatus("SAFE");
        }

        return dto;
    }
}