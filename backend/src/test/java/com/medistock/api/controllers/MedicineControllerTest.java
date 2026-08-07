package com.medistock.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medistock.api.dto.MedicineDTO;
import com.medistock.api.dto.MedicineRequest;
import com.medistock.api.dto.StockAdjustmentRequest;
import com.medistock.api.models.StockMovementType;
import com.medistock.api.services.MedicineService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MedicineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MedicineService medicineService;

    @Test
    @WithMockUser(roles = "STAFF")
    void testGetMedicines_asStaff_returns200() throws Exception {
        MedicineDTO dto = new MedicineDTO();
        dto.setName("Paracetamol");
        dto.setQuantity(50);
        
        when(medicineService.getAllMedicines(any(), any(), any()))
                .thenReturn(new PageImpl<>(Collections.singletonList(dto)));

        mockMvc.perform(get("/api/medicines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Paracetamol"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateMedicine_asAdmin_returns200() throws Exception {
        MedicineRequest request = new MedicineRequest();
        request.setName("Aspirin");
        request.setQuantity(100);
        request.setPrice(10.5);
        request.setBatchNumber("B123");
        request.setManufacturingDate(java.time.LocalDate.now().minusMonths(1));
        request.setExpiryDate(java.time.LocalDate.now().plusMonths(12));

        MedicineDTO response = new MedicineDTO();
        response.setName("Aspirin");

        when(medicineService.createMedicine(any(MedicineRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aspirin"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    void testCreateMedicine_asStaff_returns403() throws Exception {
        MedicineRequest request = new MedicineRequest();
        request.setName("Aspirin");
        request.setQuantity(100);
        request.setPrice(10.5);
        request.setBatchNumber("B123");
        request.setManufacturingDate(java.time.LocalDate.now().minusMonths(1));
        request.setExpiryDate(java.time.LocalDate.now().plusMonths(12));

        mockMvc.perform(post("/api/medicines")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testAdjustStock_returns200() throws Exception {
        StockAdjustmentRequest request = new StockAdjustmentRequest();
        request.setMedicineId(1L);
        request.setQuantity(10);
        request.setMovementType(StockMovementType.IN);
        request.setReason("Restock");

        MedicineDTO response = new MedicineDTO();
        response.setName("Aspirin");
        response.setQuantity(110);

        when(medicineService.adjustStock(any(StockAdjustmentRequest.class), eq("admin"))).thenReturn(response);

        mockMvc.perform(post("/api/medicines/adjust-stock")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(110));
    }
}
