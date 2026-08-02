package com.medistock.backend.controller;
import com.medistock.backend.service.NotificationService;
import com.medistock.backend.entity.Medicine;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.service.EmailService;
// <-- Add this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {
    @Autowired
    private EmailService emailService;


        @Autowired
        private NotificationService notificationService;

        private final MedicineRepository medicineRepository;

        public MedicineController(MedicineRepository medicineRepository) {
            this.medicineRepository = medicineRepository;
        }

    // View all medicines
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }
    @GetMapping("/low-stock")
public List<Medicine> getLowStockMedicines() {
    return medicineRepository.findAll()
            .stream()
            .filter(medicine -> medicine.getQuantity() <= medicine.getLowStockLimit())
            .toList();
}
    // View expired medicines
    @GetMapping("/expired")
    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }

    // Dashboard summary
    @GetMapping("/dashboard-summary")
    public Map<String, Long> getDashboardSummary() {
        long totalMedicines = medicineRepository.count();
        long lowStockMedicines = medicineRepository.findAll()
        .stream()
        .filter(medicine -> medicine.getQuantity() <= medicine.getLowStockLimit())
        .count();
        long expiredMedicines = medicineRepository.findByExpiryDateBefore(LocalDate.now()).size();

        Map<String, Long> summary = new HashMap<>();
        summary.put("totalMedicines", totalMedicines);

        summary.put("lowStockMedicines", lowStockMedicines);
        summary.put("expiredMedicines", expiredMedicines);

        return summary;
    }

    // View one medicine using ID
    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable Long id) {
        return medicineRepository.findById(id).orElse(null);
    }

    // Add a new medicine
    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {

        Medicine savedMedicine = medicineRepository.save(medicine);
        notificationService.saveNotification(
                "Medicine Added",
                "Medicine " + savedMedicine.getName() + " was added successfully."
        );

        String html =
                "<html>" +
                        "<body style='font-family:Arial;background:#f4f4f4;padding:20px;'>" +

                        "<div style='max-width:650px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.2);'>" +

                        "<div style='background:#8B5E3C;color:white;padding:18px;text-align:center;font-size:24px;font-weight:bold;'>" +
                        "💊 MediStock Notification" +
                        "</div>" +

                        "<div style='padding:20px;'>" +

                        "<h2 style='color:#8B5E3C;'>New Medicine Added</h2>" +

                        "<table style='width:100%;border-collapse:collapse;'>" +

                        "<tr style='background:#f5e6d3;'>" +
                        "<th style='padding:12px;border:1px solid #ddd;'>Medicine</th>" +
                        "<th style='padding:12px;border:1px solid #ddd;'>Category</th>" +
                        "<th style='padding:12px;border:1px solid #ddd;'>Quantity</th>" +
                        "<th style='padding:12px;border:1px solid #ddd;'>Expiry Date</th>" +
                        "</tr>" +

                        "<tr>" +
                        "<td style='padding:12px;border:1px solid #ddd;'>" + savedMedicine.getName() + "</td>" +
                        "<td style='padding:12px;border:1px solid #ddd;'>" + savedMedicine.getCategory() + "</td>" +
                        "<td style='padding:12px;border:1px solid #ddd;'>" + savedMedicine.getQuantity() + "</td>" +
                        "<td style='padding:12px;border:1px solid #ddd;'>" + savedMedicine.getExpiryDate() + "</td>" +
                        "</tr>" +

                        "</table>" +

                        "<br>" +

                        "<div style='background:#fff3cd;padding:15px;border-left:6px solid orange;border-radius:6px;'>" +
                        "Medicine has been successfully added to the inventory." +
                        "</div>" +

                        "<br>" +

                        "<p>Regards,<br><b>MediStock Team</b></p>" +

                        "</div>" +
                        "</div>" +

                        "</body>" +
                        "</html>";
        emailService.sendMail(
                "aishupatlolla19@gmail.com",
                "New Medicine Added",
                html
        );

        return savedMedicine;
    }
    // Update a medicine
    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        Medicine existingMedicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        existingMedicine.setName(medicine.getName());
        existingMedicine.setBatchNumber(medicine.getBatchNumber());
        existingMedicine.setCategory(medicine.getCategory());
        existingMedicine.setSupplier(medicine.getSupplier());
        existingMedicine.setQuantity(medicine.getQuantity());
        existingMedicine.setManufacturingDate(medicine.getManufacturingDate());
        existingMedicine.setExpiryDate(medicine.getExpiryDate());
        existingMedicine.setPrice(medicine.getPrice());
        existingMedicine.setLowStockLimit(medicine.getLowStockLimit());

        return medicineRepository.save(existingMedicine);
    }

    // Delete a medicine
    @DeleteMapping("/{id}")
    public void deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
    }
}