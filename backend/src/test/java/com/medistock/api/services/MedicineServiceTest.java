package com.medistock.api.services;

import com.medistock.api.dto.MedicineDTO;
import com.medistock.api.dto.MedicineRequest;
import com.medistock.api.dto.StockAdjustmentRequest;
import com.medistock.api.models.*;
import com.medistock.api.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {

    @Mock private MedicineRepository medicineRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SupplierRepository supplierRepository;
    @Mock private StockLogRepository stockLogRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private MedicineService medicineService;

    private Medicine testMedicine;
    private User testUser;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category("Painkillers", "Pain relief");
        testCategory.setId(1L);

        testMedicine = new Medicine();
        testMedicine.setId(1L);
        testMedicine.setName("Paracetamol");
        testMedicine.setQuantity(50);
        testMedicine.setCategory(testCategory);
        testMedicine.setExpiryDate(LocalDate.now().plusMonths(6));

        testUser = new User("admin", "pass", "admin@test.com", UserRole.ADMIN);
    }

    @Test
    void testCreateMedicine_success() {
        MedicineRequest req = new MedicineRequest();
        req.setName("Paracetamol");
        req.setQuantity(50);
        req.setCategoryId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(testMedicine);

        MedicineDTO dto = medicineService.createMedicine(req);

        assertNotNull(dto);
        assertEquals("Paracetamol", dto.getName());
        assertEquals(50, dto.getQuantity());
        assertEquals("Painkillers", dto.getCategoryName());
        verify(medicineRepository).save(any(Medicine.class));
    }

    @Test
    void testCreateMedicine_invalidCategory_throwsException() {
        MedicineRequest req = new MedicineRequest();
        req.setName("Paracetamol");
        req.setCategoryId(99L);

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> medicineService.createMedicine(req));
        verify(medicineRepository, never()).save(any(Medicine.class));
    }

    @Test
    void testAdjustStock_OUT_belowZero_throwsException() {
        StockAdjustmentRequest req = new StockAdjustmentRequest();
        req.setMedicineId(1L);
        req.setQuantity(100); // Exceeds 50
        req.setMovementType(StockMovementType.OUT);
        req.setReason("Dispense");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(testMedicine));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));

        assertThrows(RuntimeException.class, () -> medicineService.adjustStock(req, "admin"));
        verify(medicineRepository, never()).save(any(Medicine.class));
        verify(stockLogRepository, never()).save(any(StockLog.class));
    }

    @Test
    void testAdjustStock_IN_success() {
        StockAdjustmentRequest req = new StockAdjustmentRequest();
        req.setMedicineId(1L);
        req.setQuantity(20);
        req.setMovementType(StockMovementType.IN);
        req.setReason("Restock");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(testMedicine));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(testMedicine);

        medicineService.adjustStock(req, "admin");

        assertEquals(70, testMedicine.getQuantity()); // 50 + 20
        verify(medicineRepository).save(testMedicine);
        verify(stockLogRepository).save(any(StockLog.class));
    }

    @Test
    void testGetLowStockMedicines_returnsCorrectList() {
        when(medicineRepository.findByQuantityLessThanEqual(10))
                .thenReturn(Collections.singletonList(testMedicine));

        List<MedicineDTO> list = medicineService.getLowStockMedicines(10);

        assertEquals(1, list.size());
        assertEquals("Paracetamol", list.get(0).getName());
    }

    @Test
    void testGetExpiringMedicines_returnsCorrectList() {
        when(medicineRepository.findExpiringBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(testMedicine));

        List<MedicineDTO> list = medicineService.getExpiringMedicines(30);

        assertEquals(1, list.size());
        assertEquals("Paracetamol", list.get(0).getName());
    }
}
