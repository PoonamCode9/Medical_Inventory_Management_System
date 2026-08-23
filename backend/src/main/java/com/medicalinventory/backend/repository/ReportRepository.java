package com.medicalinventory.backend.repository;

import com.medicalinventory.backend.entity.Report;
import com.medicalinventory.backend.entity.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByGeneratedByUserId(Long userId);

    // ReportRepository.java में जोड़ें:
    @Modifying
    @Transactional
    @Query("UPDATE Report r SET r.generatedBy = null WHERE r.generatedBy = :user")
    void unlinkUserFromReports(@Param("user") User user);
}