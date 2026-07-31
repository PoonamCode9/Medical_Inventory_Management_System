package com.medistock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medistock.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

}