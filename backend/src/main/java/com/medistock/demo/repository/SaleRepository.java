package com.medistock.demo.repository;


import com.medistock.demo.entity.Medicine;
import com.medistock.demo.entity.Sale;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;



public interface SaleRepository 
        extends JpaRepository<Sale, Long> {



    // =====================================
    // SALES BY USER
    // =====================================

    List<Sale> findBySoldById(Long userId);




    // =====================================
    // COUNT SALES BETWEEN DATES
    // =====================================

    long countBySaleDateBetween(

            LocalDateTime start,

            LocalDateTime end

    );




    // =====================================
    // CHECK MEDICINE SALES EXISTENCE
    // =====================================

    boolean existsByMedicine(
            Medicine medicine
    );




    // =====================================
    // DELETE SALES BY MEDICINE
    // =====================================

    void deleteByMedicine(
            Medicine medicine
    );


}