package com.medistock.backend.repository;

import com.medistock.backend.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    /** Every medicine that is expired or will expire on/before the given date. */
    List<Medicine> findByExpiryDateLessThanEqual(LocalDate cutoff);
}
