package com.example.backend.dto;

import java.util.List;

public class DispenseHistoryResponseDto {

    private List<DispenseHistoryRowDto> history;

    public List<DispenseHistoryRowDto> getHistory() {
        return history;
    }

    public void setHistory(List<DispenseHistoryRowDto> history) {
        this.history = history;
    }
}

