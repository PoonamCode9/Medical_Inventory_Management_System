package com.medicalinventory.backend.dto;

public class ReportRequestDTO {
    private String reportType; 
    private String format;     
    
    public ReportRequestDTO() {}

    public ReportRequestDTO(String reportType, String format) {
        this.reportType = reportType;
        this.format = format;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}