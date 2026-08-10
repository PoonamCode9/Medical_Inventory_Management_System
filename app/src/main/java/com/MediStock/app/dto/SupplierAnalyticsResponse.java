package com.MediStock.app.dto;

public class SupplierAnalyticsResponse {

    private Long totalSuppliers;

    private Long activeSuppliers;

    private Long inactiveSuppliers;

    private Long totalMedicinesSupplied;

    public SupplierAnalyticsResponse() {
    }

    public Long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(Long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public Long getActiveSuppliers() {
        return activeSuppliers;
    }

    public void setActiveSuppliers(Long activeSuppliers) {
        this.activeSuppliers = activeSuppliers;
    }

    public Long getInactiveSuppliers() {
        return inactiveSuppliers;
    }

    public void setInactiveSuppliers(Long inactiveSuppliers) {
        this.inactiveSuppliers = inactiveSuppliers;
    }

    public Long getTotalMedicinesSupplied() {
        return totalMedicinesSupplied;
    }

    public void setTotalMedicinesSupplied(Long totalMedicinesSupplied) {
        this.totalMedicinesSupplied = totalMedicinesSupplied;
    }

}