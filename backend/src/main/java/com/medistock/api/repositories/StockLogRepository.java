package com.medistock.api.repositories;

import com.medistock.api.models.StockLog;
import com.medistock.api.models.StockMovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {

    List<StockLog> findByMedicineIdOrderByTimestampDesc(Long medicineId);

    Page<StockLog> findAllByOrderByTimestampDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM StockLog s WHERE s.movementType = :type")
    Long sumQuantityByMovementType(@Param("type") StockMovementType type);

    /**
     * Returns raw StockLog entries after a given timestamp, used to build daily trend data.
     */
    @Query("SELECT s FROM StockLog s WHERE s.timestamp >= :since ORDER BY s.timestamp ASC")
    List<StockLog> findAllSince(@Param("since") LocalDateTime since);

    /**
     * Count total distinct log entries (for activity metric).
     */
    long countByMovementType(StockMovementType type);
}
