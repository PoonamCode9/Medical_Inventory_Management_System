package com.example.backend;

import com.example.backend.dto.DispenseHistoryResponseDto;
import com.example.backend.dto.DispenseHistoryRowDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminDispenseHistoryController {

    private final DispenseItemRepository dispenseItemRepository;

    public AdminDispenseHistoryController(DispenseItemRepository dispenseItemRepository) {
        this.dispenseItemRepository = dispenseItemRepository;
    }

    @GetMapping("/dispenses/history")
    public ResponseEntity<DispenseHistoryResponseDto> history() {
        List<DispenseItem> rows = dispenseItemRepository.findAll();

        // Sort newest-first by dispense.createdAt (desc). Fallback to dispense id.
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        List<DispenseHistoryRowDto> history = rows.stream()
                .sorted(Comparator.comparing((DispenseItem di) -> di.getDispense().getCreatedAt(), Comparator.nullsLast(Comparator.naturalOrder())).reversed()
                        .thenComparing(di -> di.getDispense().getId(), Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(di -> {
                    DispenseHistoryRowDto dto = new DispenseHistoryRowDto();
                    dto.setDispenseId(di.getDispense().getId());

                    if (di.getDispense().getCreatedAt() != null) {
                        dto.setDate(fmt.format(di.getDispense().getCreatedAt()));
                    } else {
                        dto.setDate(null);
                    }

                    dto.setPharmacistName(di.getDispense().getDispensedBy().getName());
                    dto.setMedicineName(di.getMedicine().getName());
                    dto.setQuantityDispensed(di.getQuantity());
                    dto.setRemarks(di.getDispense().getRemarks());
                    return dto;
                })
                .toList();

        DispenseHistoryResponseDto resp = new DispenseHistoryResponseDto();
        resp.setHistory(history);
        return ResponseEntity.ok(resp);
    }
}

