package com.medistock.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medistock.backend.entity.LowStockSnapshot;

public interface LowStockSnapshotRepository extends JpaRepository<LowStockSnapshot, Integer> {

    Optional<LowStockSnapshot> findBySnapshotDate(LocalDate date);

    List<LowStockSnapshot> findBySnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(LocalDate from);
}