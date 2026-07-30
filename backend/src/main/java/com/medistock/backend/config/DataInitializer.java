package com.medistock.backend.config;

import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        Role pharmacistRole = roleRepository.findByName("ROLE_PHARMACIST")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_PHARMACIST")));
        Role staffRole = roleRepository.findByName("ROLE_STAFF")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_STAFF")));

        // 2. Initialize Users
        if (!userRepository.existsByEmail("admin@medistock.com")) {
            User admin = new User(
                    "admin@medistock.com",
                    passwordEncoder.encode("admin123"),
                    "Aditya",
                    "Sharma",
                    "9876543210",
                    adminRole
            );
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("pharmacist@medistock.com")) {
            User pharmacist = new User(
                    "pharmacist@medistock.com",
                    passwordEncoder.encode("pharmacist123"),
                    "Rajesh",
                    "Kumar",
                    "9876543211",
                    pharmacistRole
            );
            userRepository.save(pharmacist);
        }

        if (!userRepository.existsByEmail("staff@medistock.com")) {
            User staff = new User(
                    "staff@medistock.com",
                    passwordEncoder.encode("staff123"),
                    "Sonia",
                    "Verma",
                    "9876543212",
                    staffRole
            );
            userRepository.save(staff);
        }

        // 3. Initialize Categories
        Category antibiotics = categoryRepository.findByName("Antibiotics")
                .orElseGet(() -> categoryRepository.save(new Category("Antibiotics", "Antibacterial medications")));
        Category analgesics = categoryRepository.findByName("Analgesics")
                .orElseGet(() -> categoryRepository.save(new Category("Analgesics", "Pain relief medications")));
        Category vitamins = categoryRepository.findByName("Vitamins")
                .orElseGet(() -> categoryRepository.save(new Category("Vitamins", "Nutritional supplements")));
        Category cardiovascular = categoryRepository.findByName("Cardiovascular")
                .orElseGet(() -> categoryRepository.save(new Category("Cardiovascular", "Heart related medicines")));

        // 4. Initialize Suppliers
        Supplier cipla = null;
        if (supplierRepository.findAll().isEmpty()) {
            cipla = supplierRepository.save(new Supplier("Cipla Ltd", "Dr. Amit Shah", "contact@cipla.com", "02224951234", "Mumbai, Maharashtra"));
            supplierRepository.save(new Supplier("Sun Pharmaceutical Industries", "Mr. Vikram Mehta", "info@sunpharma.com", "02243241234", "Vadodara, Gujarat"));
            supplierRepository.save(new Supplier("Dr. Reddy's Laboratories", "Ms. Neha Reddy", "queries@drreddys.com", "04049002200", "Hyderabad, Telangana"));
        } else {
            cipla = supplierRepository.findAll().get(0);
        }

        // 5. Initialize Medicines & Inventory (if empty)
        if (medicineRepository.findAll().isEmpty() && cipla != null) {
            Medicine paracetamol = medicineRepository.save(new Medicine(
                    "Paracetamol 650mg",
                    "Paracetamol",
                    analgesics,
                    cipla,
                    "Common pain relief and antipyretic medicine",
                    BigDecimal.valueOf(10.00),
                    BigDecimal.valueOf(15.00),
                    150,
                    20
            ));

            Medicine amoxicillin = medicineRepository.save(new Medicine(
                    "Amoxicillin 500mg",
                    "Amoxicillin",
                    antibiotics,
                    cipla,
                    "Broad spectrum penicillin antibiotic",
                    BigDecimal.valueOf(45.00),
                    BigDecimal.valueOf(60.00),
                    12, // Close to low stock threshold (15)
                    15
            ));

            Medicine vitaminC = medicineRepository.save(new Medicine(
                    "Vitamin C Chewable",
                    "Ascorbic Acid",
                    vitamins,
                    cipla,
                    "Immune boosting nutritional supplement",
                    BigDecimal.valueOf(25.00),
                    BigDecimal.valueOf(35.00),
                    80,
                    25
            ));

            Medicine atorvastatin = medicineRepository.save(new Medicine(
                    "Atorvastatin 10mg",
                    "Atorvastatin",
                    cardiovascular,
                    cipla,
                    "Cholesterol lowering medication",
                    BigDecimal.valueOf(80.00),
                    BigDecimal.valueOf(110.00),
                    5, // Under low stock (alert 10)
                    10
            ));

            // Create Inventory Batches
            inventoryRepository.save(new Inventory(paracetamol, "B-PR101", 100, LocalDate.now().plusMonths(12), "Shelf A-1"));
            inventoryRepository.save(new Inventory(paracetamol, "B-PR102", 50, LocalDate.now().plusMonths(14), "Shelf A-2"));
            inventoryRepository.save(new Inventory(amoxicillin, "B-AM201", 12, LocalDate.now().plusMonths(6), "Shelf B-1"));
            inventoryRepository.save(new Inventory(vitaminC, "B-VT301", 80, LocalDate.now().plusMonths(18), "Shelf C-1"));
            inventoryRepository.save(new Inventory(atorvastatin, "B-AT401", 5, LocalDate.now().plusMonths(1), "Shelf D-1")); // Expiring soon
        }
    }
}
