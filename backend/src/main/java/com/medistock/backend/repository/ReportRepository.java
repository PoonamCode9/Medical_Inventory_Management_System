package com.medistock.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Integer>{

    List<Report> findByGeneratedBy_UserId(Integer userId);

}