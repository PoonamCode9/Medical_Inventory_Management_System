package com.medical.om.om_backend.repository;

import com.medical.om.om_backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findTop5ByOrderByIdDesc();

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(COALESCE(m.description, '')) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Medicine> search(@Param("q") String q);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiration_date IS NULL OR m.expiration_date >= CURRENT_DATE")
    long countActive();

    long countByIdIn(Set<Long> ids);
}
