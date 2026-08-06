package com.example.backend.junction;

import com.example.backend.dto.MedicineSlimDto;
import com.example.backend.dto.SupplierSlimDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public class SupplierMedicineJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public SupplierMedicineJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<SupplierSlimDto> findSuppliersByMedicineId(Integer medicineId) {
        if (medicineId == null) return Collections.emptyList();

        return jdbcTemplate.query(
                "SELECT s.id, s.name " +
                        "FROM suppliers s " +
                        "JOIN supplier_medicines sm ON sm.supplier_id = s.id " +
                        "WHERE sm.medicine_id = ? " +
                        "ORDER BY s.name",
                (rs, rowNum) -> new SupplierSlimDto(rs.getInt("id"), rs.getString("name")),
                medicineId
        );
    }

    public List<MedicineSlimDto> findMedicinesBySupplierId(Integer supplierId) {
        if (supplierId == null) return Collections.emptyList();

        return jdbcTemplate.query(
                "SELECT m.id, m.name " +
                        "FROM medicines m " +
                        "JOIN supplier_medicines sm ON sm.medicine_id = m.id " +
                        "WHERE sm.supplier_id = ? " +
                        "ORDER BY m.name",
                (rs, rowNum) -> new MedicineSlimDto(rs.getInt("id"), rs.getString("name")),
                supplierId
        );
    }

    public List<Integer> findSupplierIdsByMedicineId(Integer medicineId) {
        if (medicineId == null) return Collections.emptyList();

        return jdbcTemplate.queryForList(
                "SELECT supplier_id FROM supplier_medicines WHERE medicine_id = ? ORDER BY supplier_id",
                Integer.class,
                medicineId
        );
    }

    public void replaceSuppliersForMedicine(Integer medicineId, List<Integer> supplierIds) {
        if (medicineId == null) return;

        jdbcTemplate.update("DELETE FROM supplier_medicines WHERE medicine_id = ?", medicineId);

        if (supplierIds == null || supplierIds.isEmpty()) return;

        // Bulk insert
        for (Integer supplierId : supplierIds) {
            if (supplierId == null) continue;
            jdbcTemplate.update(
                    "INSERT INTO supplier_medicines (supplier_id, medicine_id) VALUES (?, ?)",
                    supplierId,
                    medicineId
            );
        }
    }

public List<Integer> findMedicineIdsBySupplier(Integer supplierId) {
        if (supplierId == null) return Collections.emptyList();

        return jdbcTemplate.queryForList(
                "SELECT medicine_id FROM supplier_medicines WHERE supplier_id = ? ORDER BY medicine_id",
                Integer.class,
                supplierId
        );
    }

    public void deleteSuppliersForMedicine(Integer medicineId) {
        if (medicineId == null) return;
        jdbcTemplate.update("DELETE FROM supplier_medicines WHERE medicine_id = ?", medicineId);
    }
}

