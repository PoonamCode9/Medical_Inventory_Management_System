package com.medistock.backend.config;

import com.medistock.backend.model.Medicine;
import com.medistock.backend.model.Supplier;
import com.medistock.backend.repository.MedicineRepository;
import com.medistock.backend.repository.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Seeds the (in-memory, by default) database with demo data on startup so the
 * API and the email notification flow can be tried out immediately, without
 * manually creating records first. Mirrors the mock data in frontend/src/App.jsx.
 * Safe to delete once you're wiring up real data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;

    public DataSeeder(SupplierRepository supplierRepository, MedicineRepository medicineRepository) {
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
    }

    @Override
    public void run(String... args) {
        if (supplierRepository.count() > 0) return; // already seeded

        Supplier s1 = save(new Supplier(), "MedSource Pharma", "+91 98765 43210", "contact@medsource.example", "12 Industrial Rd, Chennai, TN", 92);
        Supplier s2 = save(new Supplier(), "Global Health Distributors", "+91 90123 45678", "sales@ghdist.example", "4th Cross, Bengaluru, KA", 78);
        Supplier s3 = save(new Supplier(), "CarePlus Supplies", "+91 91234 56789", "hello@careplus.example", "22 Anna Salai, Chennai, TN", 88);

        LocalDate today = LocalDate.now();

        // A safe, far-future item.
        addMedicine("Paracetamol 500mg", "BN-24011-A", "Analgesics", s1, 420, 100,
                today.minusMonths(6), today.plusYears(2), 0.05, "tablet");

        // Already expired -> should trigger an EXPIRED alert.
        addMedicine("Amoxicillin 250mg", "BN-24087-C", "Antibiotics", s2, 60, 80,
                today.minusMonths(10), today.minusDays(5), 0.12, "capsule");

        // Expires in 15 days -> CRITICAL.
        addMedicine("Omeprazole 20mg", "BN-23120-D", "Antacids", s3, 15, 50,
                today.minusMonths(8), today.plusDays(15), 0.15, "capsule");

        // Expires in 60 days -> NEAR EXPIRY.
        addMedicine("Atorvastatin 10mg", "BN-24022-F", "Cardiac Care", s1, 5, 40,
                today.minusMonths(5), today.plusDays(60), 0.20, "tablet");
    }

    private Supplier save(Supplier s, String name, String contact, String email, String address, int performance) {
        s.setName(name); s.setContact(contact); s.setEmail(email); s.setAddress(address); s.setPerformance(performance);
        return supplierRepository.save(s);
    }

    private void addMedicine(String name, String batch, String category, Supplier supplier, int qty, int reorder,
                              LocalDate mfg, LocalDate expiry, double price, String unit) {
        Medicine m = new Medicine();
        m.setName(name);
        m.setBatchNumber(batch);
        m.setCategory(category);
        m.setSupplier(supplier);
        m.setQuantity(qty);
        m.setReorderLevel(reorder);
        m.setMfgDate(mfg);
        m.setExpiryDate(expiry);
        m.setPrice(price);
        m.setUnit(unit);
        medicineRepository.save(m);
    }
}
