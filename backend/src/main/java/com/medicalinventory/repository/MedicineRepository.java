
package com.medicalinventory.repository;

import com.medicalinventory.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    Optional<Medicine> findByBatchNo(String batchNo);

    boolean existsByBatchNo(String batchNo);

    List<Medicine> findAllByOrderByMedicineNameAsc();
}
