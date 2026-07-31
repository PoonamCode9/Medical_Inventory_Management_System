package com.example.backend.dto;

import java.util.List;

public class AlertsResponseDto {

    private List<AlertRowDto> expireSoon;
    private List<AlertRowDto> lowStock;

    public AlertsResponseDto() {
    }

    public List<AlertRowDto> getExpireSoon() {
        return expireSoon;
    }

    public void setExpireSoon(List<AlertRowDto> expireSoon) {
        this.expireSoon = expireSoon;
    }

    public List<AlertRowDto> getLowStock() {
        return lowStock;
    }

    public void setLowStock(List<AlertRowDto> lowStock) {
        this.lowStock = lowStock;
    }
}

