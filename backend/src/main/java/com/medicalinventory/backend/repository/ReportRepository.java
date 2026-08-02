package com.medicalinventory.backend.repository;

import com.medicalinventory.backend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByGeneratedByUserId(Long userId);
}