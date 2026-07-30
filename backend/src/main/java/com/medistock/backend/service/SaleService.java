package com.medistock.backend.service;

import com.medistock.backend.dto.SaleDTO;
import java.util.List;

public interface SaleService {
    List<SaleDTO> getAllSales();
    SaleDTO getSaleById(Long id);
    SaleDTO createSale(SaleDTO saleDTO);
}
