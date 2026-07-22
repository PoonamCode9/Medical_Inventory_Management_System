package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findTop5ByOrderByIdDesc();

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(COALESCE(m.description, '')) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Medicine> search(@Param("q") String q);
}
