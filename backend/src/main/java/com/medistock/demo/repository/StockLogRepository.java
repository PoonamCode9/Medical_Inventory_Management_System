package com.medistock.demo.repository;


import com.medistock.demo.entity.StockLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface StockLogRepository 
        extends JpaRepository<StockLog, Long>{



    // Get logs by medicine id
    List<StockLog> findByMedicine_Id(Long medicineId);




    // Delete all stock logs related to medicine
    void deleteByMedicine_Id(Long medicineId);



}