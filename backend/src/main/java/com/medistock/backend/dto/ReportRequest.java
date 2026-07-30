package com.medistock.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {

    private Integer generatedBy;

    private String reportType;

}