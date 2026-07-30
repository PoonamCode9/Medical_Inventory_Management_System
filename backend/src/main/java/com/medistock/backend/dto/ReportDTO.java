package com.medistock.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDTO {

    private Integer reportId;

    private Integer generatedBy;

    private String generatedByName;

    private String reportType;

    private LocalDateTime generatedAt;
}