package com.medistock.backend.service;

import com.medistock.backend.dto.PurchaseDTO;
import java.util.List;

public interface PurchaseService {
    List<PurchaseDTO> getAllPurchases();
    PurchaseDTO getPurchaseById(Long id);
    PurchaseDTO createPurchase(PurchaseDTO purchaseDTO);
}
