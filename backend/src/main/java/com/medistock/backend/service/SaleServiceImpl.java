package com.medistock.backend.service;

import com.medistock.backend.config.UserDetailsImpl;
import com.medistock.backend.dto.SaleDTO;
import com.medistock.backend.dto.SaleItemDTO;
import com.medistock.backend.exception.BadRequestException;
import com.medistock.backend.exception.ResourceNotFoundException;
import com.medistock.backend.model.*;
import com.medistock.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<SaleDTO> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SaleDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale invoice not found with id: " + id));
        return convertToDTO(sale);
    }

    @Override
    public SaleDTO createSale(SaleDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User pharmacist = null;
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            pharmacist = userRepository.findById(userDetails.getId()).orElse(null);
        }

        if (pharmacist == null) {
            // Fallback for demo/startup seeding or unauthenticated actions (if any)
            pharmacist = userRepository.findAll().stream()
                    .filter(u -> u.getRole().getName().equals("ROLE_PHARMACIST"))
                    .findFirst()
                    .orElseGet(() -> userRepository.findAll().get(0));
        }

        Sale sale = new Sale();
        sale.setPharmacist(pharmacist);
        sale.setCustomerName(dto.getCustomerName());
        sale.setCustomerPhone(dto.getCustomerPhone());
        sale.setSaleDate(LocalDateTime.now());
        sale.setPaymentMode(dto.getPaymentMode() != null ? dto.getPaymentMode() : "CASH");

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;
        List<SaleItem> items = new ArrayList<>();

        Sale savedSale = saleRepository.save(sale);

        for (SaleItemDTO itemDto : dto.getItems()) {
            Medicine medicine = medicineRepository.findById(itemDto.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemDto.getMedicineId()));

            // Find batch in inventory
            Inventory batch = inventoryRepository.findByMedicineIdAndBatchNumber(medicine.getId(), itemDto.getBatchNumber())
                    .orElseThrow(() -> new BadRequestException("Batch " + itemDto.getBatchNumber() + " not found for medicine: " + medicine.getName()));

            if (batch.getQuantity() < itemDto.getQuantity()) {
                throw new BadRequestException("Insufficient stock in batch " + itemDto.getBatchNumber() + " for medicine: " + medicine.getName() + ". Available: " + batch.getQuantity() + ", requested: " + itemDto.getQuantity());
            }

            // Deduct from batch
            batch.setQuantity(batch.getQuantity() - itemDto.getQuantity());
            inventoryRepository.save(batch);

            // Update total cached stock of medicine
            List<Inventory> allBatches = inventoryRepository.findByMedicineId(medicine.getId());
            int totalStock = allBatches.stream().mapToInt(Inventory::getQuantity).sum();
            medicine.setStockQuantity(totalStock);
            medicineRepository.save(medicine);

            // Sum prices
            BigDecimal itemTotal = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            total = total.add(itemTotal);

            // Seed GST (12% standard GST included in pricing)
            // Amount = Total / 1.12, GST = Total - (Total / 1.12)
            BigDecimal subtotal = itemTotal.divide(BigDecimal.valueOf(1.12), 2, BigDecimal.ROUND_HALF_UP);
            BigDecimal gst = itemTotal.subtract(subtotal);
            gstTotal = gstTotal.add(gst);

            SaleItem item = new SaleItem();
            item.setSale(savedSale);
            item.setMedicine(medicine);
            item.setBatchNumber(itemDto.getBatchNumber());
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(itemDto.getUnitPrice());
            items.add(item);
        }

        savedSale.getItems().clear();
        savedSale.getItems().addAll(items);
        savedSale.setTotalAmount(total);
        savedSale.setGstAmount(gstTotal);

        Sale finalSaved = saleRepository.save(savedSale);

        auditLogService.logAction("CREATE_SALE_BILL", "Created sales bill ID: " + finalSaved.getId() + " total: ₹" + finalSaved.getTotalAmount() + " customer: " + finalSaved.getCustomerName());

        notificationService.checkLowStockAndCreateNotifications();

        return convertToDTO(finalSaved);
    }

    private SaleDTO convertToDTO(Sale s) {
        SaleDTO dto = new SaleDTO();
        dto.setId(s.getId());
        dto.setPharmacistId(s.getPharmacist().getId());
        dto.setPharmacistName(s.getPharmacist().getFirstName() + " " + s.getPharmacist().getLastName());
        dto.setCustomerName(s.getCustomerName());
        dto.setCustomerPhone(s.getCustomerPhone());
        dto.setSaleDate(s.getSaleDate());
        dto.setTotalAmount(s.getTotalAmount());
        dto.setGstAmount(s.getGstAmount());
        dto.setPaymentMode(s.getPaymentMode());
        dto.setItems(s.getItems().stream().map(item -> {
            SaleItemDTO itemDto = new SaleItemDTO();
            itemDto.setMedicineId(item.getMedicine().getId());
            itemDto.setMedicineName(item.getMedicine().getName());
            itemDto.setBatchNumber(item.getBatchNumber());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
