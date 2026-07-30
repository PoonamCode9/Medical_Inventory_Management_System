package com.medistock.backend.service;

import java.util.List;

import com.medistock.backend.dto.ExpiryDTO;

public interface ExpiryService {

    List<ExpiryDTO> getExpiringSoon();

    List<ExpiryDTO> getExpiredMedicines();

    List<ExpiryDTO> getAllExpiryMedicines();

}