package com.example.backend.dto;

import java.util.List;

public class DispenseRequestDto {

    private List<DispenseItemRequestDto> items;
    private String remarks;

    public List<DispenseItemRequestDto> getItems() {
        return items;
    }

    public void setItems(List<DispenseItemRequestDto> items) {
        this.items = items;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public static class DispenseItemRequestDto {
        private Integer medicineId;
        private Integer quantity;

        public Integer getMedicineId() {
            return medicineId;
        }

        public void setMedicineId(Integer medicineId) {
            this.medicineId = medicineId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}

