package com.medistock.api.services;

import com.medistock.api.dto.AnalyticsDTO;
import com.medistock.api.models.Medicine;
import com.medistock.api.models.StockLog;
import com.medistock.api.models.StockMovementType;
import com.medistock.api.repositories.MedicineRepository;
import com.medistock.api.repositories.PurchaseOrderRepository;
import com.medistock.api.repositories.StockLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock private MedicineRepository medicineRepository;
    @Mock private StockLogRepository stockLogRepository;
    @Mock private PurchaseOrderRepository purchaseOrderRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGetInventoryAnalytics_returnsCorrectCounts() {
        when(medicineRepository.count()).thenReturn(100L);
        when(medicineRepository.countByQuantityLessThanEqual(10)).thenReturn(5L);
        when(medicineRepository.sumInventoryValue()).thenReturn(5000.0);
        
        when(purchaseOrderRepository.count()).thenReturn(10L);
        when(purchaseOrderRepository.sumAllTotalAmount()).thenReturn(1500.0);
        
        when(medicineRepository.countByCategory()).thenReturn(new ArrayList<>());
        when(medicineRepository.countBySupplier()).thenReturn(new ArrayList<>());
        when(medicineRepository.findTopLowStock(anyInt(), any(PageRequest.class))).thenReturn(new ArrayList<>());
        when(stockLogRepository.findAllSince(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

        AnalyticsDTO dto = analyticsService.getInventoryAnalytics();

        assertNotNull(dto);
        assertEquals(100L, dto.getTotalMedicines());
        assertEquals(5L, dto.getLowStockCount());
        assertEquals(5000.0, dto.getTotalInventoryValue());
        assertEquals(10L, dto.getTotalPurchaseOrders());
        assertEquals(1500.0, dto.getTotalPurchaseSpend());
    }

    @Test
    void testDailyMovements_groupedByDate() {
        StockLog log1 = new StockLog();
        log1.setMovementType(StockMovementType.IN);
        log1.setQuantity(20);
        log1.setTimestamp(LocalDateTime.now());
        
        StockLog log2 = new StockLog();
        log2.setMovementType(StockMovementType.OUT);
        log2.setQuantity(5);
        log2.setTimestamp(LocalDateTime.now());

        when(medicineRepository.countByCategory()).thenReturn(new ArrayList<>());
        when(medicineRepository.countBySupplier()).thenReturn(new ArrayList<>());
        when(stockLogRepository.findAllSince(any(LocalDateTime.class))).thenReturn(Arrays.asList(log1, log2));

        AnalyticsDTO dto = analyticsService.getInventoryAnalytics();
        
        // 7 days trend
        assertEquals(7, dto.getDailyMovements().size());
        // Last element is today
        assertEquals(20, dto.getDailyMovements().get(6).getStockIn());
        assertEquals(5, dto.getDailyMovements().get(6).getStockOut());
    }
}
