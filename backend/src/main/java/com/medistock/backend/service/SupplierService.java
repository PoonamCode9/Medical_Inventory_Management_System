package com.medistock.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.SupplierRequest;
import com.medistock.backend.entity.Supplier;
import com.medistock.backend.repository.SupplierRepository;
@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;

 public SupplierService(
        SupplierRepository supplierRepository,
        EmailService emailService,
        EmailTemplateService emailTemplateService) {

    this.supplierRepository = supplierRepository;
    this.emailService = emailService;
    this.emailTemplateService = emailTemplateService;
}

    // Get All Suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Get Supplier By Id
    public Supplier getSupplierById(Integer id) {

        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));

    }

    // Add Supplier
public Supplier addSupplier(SupplierRequest dto) {

    Supplier supplier = new Supplier();

    supplier.setSupplierName(dto.getSupplierName());
    supplier.setContactNumber(dto.getContactNumber());
    supplier.setEmail(dto.getEmail());
    supplier.setAddress(dto.getAddress());
    supplier.setCreatedAt(LocalDateTime.now());

    Supplier savedSupplier = supplierRepository.save(supplier);

    // Send Welcome Email
    String body = """
<p>Hello <b>%s</b>,</p>

<p>
Welcome to the <b>MediStock Supplier Network</b>.
</p>

<p>
Your supplier account has been successfully registered.
</p>

<table style="border-collapse:collapse;width:100%%;margin-top:20px;">

<tr>
<td style="padding:10px;"><b>Supplier Name</b></td>
<td style="padding:10px;">%s</td>
</tr>

<tr>
<td style="padding:10px;"><b>Email</b></td>
<td style="padding:10px;">%s</td>
</tr>

<tr>
<td style="padding:10px;"><b>Phone</b></td>
<td style="padding:10px;">%s</td>
</tr>

<tr>
<td style="padding:10px;"><b>Address</b></td>
<td style="padding:10px;">%s</td>
</tr>

</table>

<br>

<p>
We look forward to working with you.
</p>

<p>
Regards,<br>
<b>MediStock Team</b>
</p>
""".formatted(
        savedSupplier.getSupplierName(),
        savedSupplier.getSupplierName(),
        savedSupplier.getEmail(),
        savedSupplier.getContactNumber(),
        savedSupplier.getAddress()
);

emailService.sendEmail(
        savedSupplier.getEmail(),
        "🎉 Welcome to MediStock",
        emailTemplateService.buildTemplate(
                "Supplier Registration Successful",
                body
        )
);

    return savedSupplier;
}
    // Update Supplier
    public Supplier updateSupplier(Integer id, SupplierRequest dto) {

        Supplier supplier = getSupplierById(id);

        supplier.setSupplierName(dto.getSupplierName());
        supplier.setContactNumber(dto.getContactNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());

        return supplierRepository.save(supplier);
    }

    // Delete Supplier
    public void deleteSupplier(Integer id) {

        Supplier supplier = getSupplierById(id);

        supplierRepository.delete(supplier);
    }

    // Search Suppliers
    public List<Supplier> searchSuppliers(String keyword) {

        return supplierRepository
                .findBySupplierNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrContactNumberContaining(
                        keyword,
                        keyword,
                        keyword
                );

    }

}