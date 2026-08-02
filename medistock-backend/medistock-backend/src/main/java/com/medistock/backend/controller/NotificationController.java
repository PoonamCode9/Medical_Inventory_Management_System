package com.medistock.backend.controller;

import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final MedicineRepository medicineRepository;

    public NotificationController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @GetMapping
    public List<String> getNotifications() {

        List<String> notifications = new ArrayList<>();

        List<Medicine> medicines = medicineRepository.findAll();

        for (Medicine medicine : medicines) {

            // Out of Stock
            if (medicine.getQuantity() == 0) {
                notifications.add("🔴 " + medicine.getName() + " is Out of Stock");
            }

            // Low Stock
            else if (medicine.getQuantity() <= medicine.getLowStockLimit()) {
                notifications.add("🟠 " + medicine.getName() + " is Low in Stock (" + medicine.getQuantity() + " left)");
            }

            // Expired
            if (medicine.getExpiryDate().isBefore(LocalDate.now())) {
                notifications.add("🔴 " + medicine.getName() + " has Expired");
            }

            // Expiring within 30 days
            else if (!medicine.getExpiryDate().isAfter(LocalDate.now().plusDays(30))) {
                notifications.add("🟡 " + medicine.getName() + " expires on " + medicine.getExpiryDate());
            }
        }

        return notifications;
    }
}