package com.example.backend;

import com.example.backend.dto.DispenseRequestDto;
import com.example.backend.dto.DispenseRequestDto.DispenseItemRequestDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pharmacist")
public class PharmacistDispenseController {

    private final DispenseRepository dispenseRepository;
    private final DispenseItemRepository dispenseItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    public PharmacistDispenseController(
            DispenseRepository dispenseRepository,
            DispenseItemRepository dispenseItemRepository,
            MedicineRepository medicineRepository,
            UserRepository userRepository
    ) {
        this.dispenseRepository = dispenseRepository;
        this.dispenseItemRepository = dispenseItemRepository;
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/dispense")
    @PreAuthorize("hasRole('Pharmacist')")
    @Transactional
    public ResponseEntity<?> dispense(
            @RequestBody DispenseRequestDto request,
            Principal principal
    ) {

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "items are required"));
        }

        // Map: medicineId -> quantity (while validating duplicates)
        List<DispenseItemRequestDto> items = request.getItems();

        Set<Integer> seen = new HashSet<>();
        for (DispenseItemRequestDto item : items) {
            if (item == null || item.getMedicineId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "medicineId is required for each item"));
            }
            if (item.getQuantity() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "quantity is required for each item"));
            }
            if (item.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "quantity must be greater than 0"));
            }
            if (!seen.add(item.getMedicineId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Same medicine cannot be added multiple times in the same transaction"));
            }
        }

        // Authenticated pharmacist id
        String email = principal == null ? null : principal.getName();
        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        User pharmacist = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Validate stock
        Map<Integer, Integer> requestedQtyByMedicine = items.stream()
                .collect(Collectors.toMap(
                        DispenseItemRequestDto::getMedicineId,
                        DispenseItemRequestDto::getQuantity
                ));

        List<Medicine> medicines = medicineRepository.findAllById(requestedQtyByMedicine.keySet());
        if (medicines.size() != requestedQtyByMedicine.size()) {
            Set<Integer> foundIds = medicines.stream().map(Medicine::getId).collect(Collectors.toSet());
            Set<Integer> missing = new HashSet<>(requestedQtyByMedicine.keySet());
            missing.removeAll(foundIds);
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid medicineId(s): " + missing));
        }

        for (Medicine m : medicines) {
            Integer req = requestedQtyByMedicine.get(m.getId());
            int available = m.getQuantity() == null ? 0 : m.getQuantity();
            if (req == null) continue;
            if (req > available) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Insufficient stock for medicineId " + m.getId(),
                        "available", available,
                        "requested", req
                ));
            }
        }

        // Create dispense header
        Dispense dispense = new Dispense();
        dispense.setDispensedBy(pharmacist);
        dispense.setRemarks(request.getRemarks());
        Dispense savedDispense = dispenseRepository.save(dispense);

        // Create items + update stock
        for (Medicine m : medicines) {
            Integer reqQty = requestedQtyByMedicine.get(m.getId());

            DispenseItem di = new DispenseItem();
            di.setDispense(savedDispense);
            di.setMedicine(m);
            di.setQuantity(reqQty);
            dispenseItemRepository.save(di);

            m.setQuantity(m.getQuantity() - reqQty);
            medicineRepository.save(m);
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "dispenseId", savedDispense.getId()
        ));
    }
}

