package com.example.backend;

import com.example.backend.Medicine;
import com.example.backend.MedicineRepository;
import com.example.backend.dto.AlertRowDto;
import com.example.backend.dto.AlertsResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/api/admin/alerts")
public class AdminAlertsController {

    private final MedicineRepository medicineRepository;

    public AdminAlertsController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    /**
     * Query medicines and compute alerts.
     *
     * @param expireWindowDays expire within next N days (default 30)
     * @param includeExpired also include already-expired batches (default true)
     * @param lowStockThreshold quantity <= threshold (default 10)
     */
    @GetMapping
    public ResponseEntity<AlertsResponseDto> getAlerts(
            @RequestParam(name = "expireWindowDays", required = false, defaultValue = "30") Integer expireWindowDays,
            @RequestParam(name = "includeExpired", required = false, defaultValue = "true") Boolean includeExpired,
            @RequestParam(name = "lowStockThreshold", required = false, defaultValue = "10") Integer lowStockThreshold
    ) {

        LocalDate today = LocalDate.now();
        LocalDate expireEnd = today.plusDays(expireWindowDays == null ? 30 : expireWindowDays);

        List<Medicine> all = medicineRepository.findAll();

        boolean includeExpiredFinal = includeExpired == null ? true : includeExpired;

        List<AlertRowDto> expireSoon = all.stream()
                .filter(m -> {
                    if (m.getExpiryDate() == null) return false;

                    if (includeExpiredFinal) {
                        // allow [today - huge.. expireEnd]
                        return !m.getExpiryDate().isAfter(expireEnd);
                    }
                    // only [today.. expireEnd]
                    return !m.getExpiryDate().isBefore(today) && !m.getExpiryDate().isAfter(expireEnd);
                })
                .map(m -> toExpireRow(m, today))
                .sorted(Comparator.comparing(AlertRowDto::getDaysToExpiry, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        List<AlertRowDto> lowStock = all.stream()
                .filter(m -> m.getQuantity() != null && lowStockThreshold != null && m.getQuantity() <= lowStockThreshold)
                .map(m -> toLowStockRow(m))
                .sorted(Comparator.comparing(AlertRowDto::getQuantity, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        AlertsResponseDto resp = new AlertsResponseDto();
        resp.setExpireSoon(expireSoon);
        resp.setLowStock(lowStock);

        return ResponseEntity.ok(resp);
    }

    private AlertRowDto toExpireRow(Medicine m, LocalDate today) {
        AlertRowDto dto = new AlertRowDto();
        dto.setMedicineId(m.getId());
        dto.setMedicineName(m.getName());
        dto.setBatchNumber(m.getBatchNumber());
        dto.setCategory(m.getCategory());
        dto.setExpiryDate(m.getExpiryDate());

        if (m.getExpiryDate() != null) {
            long days = ChronoUnit.DAYS.between(today, m.getExpiryDate());
            dto.setDaysToExpiry((int) days);
        }
        return dto;
    }

    private AlertRowDto toLowStockRow(Medicine m) {
        AlertRowDto dto = new AlertRowDto();
        dto.setMedicineId(m.getId());
        dto.setMedicineName(m.getName());
        dto.setBatchNumber(m.getBatchNumber());
        dto.setCategory(m.getCategory());
        dto.setQuantity(m.getQuantity());
        return dto;
    }
}



