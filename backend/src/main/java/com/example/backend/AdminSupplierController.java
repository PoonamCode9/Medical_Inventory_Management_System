package com.example.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/suppliers")
public class AdminSupplierController {

    private final SupplierRepository supplierRepository;

    public AdminSupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> listSuppliers() {
        return ResponseEntity.ok(supplierRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody CreateSupplierRequest request) {
        if (request == null ||
                request.getName() == null || request.getName().isBlank() ||
                request.getContactNumber() == null || request.getContactNumber().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getAddress() == null || request.getAddress().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "name, contactNumber, email and address are required"
            ));
        }

        Optional<Supplier> existing = supplierRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Email already registered"
            ));
        }

        Supplier saved = supplierRepository.save(new Supplier(
                request.getName().trim(),
                request.getContactNumber().trim(),
                request.getEmail().trim(),
                request.getAddress().trim()
        ));

        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "contactNumber", saved.getContactNumber(),
                "email", saved.getEmail(),
                "address", saved.getAddress()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Integer id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public static class CreateSupplierRequest {
        private String name;
        private String contactNumber;
        private String email;
        private String address;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getContactNumber() {
            return contactNumber;
        }

        public void setContactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }
}

