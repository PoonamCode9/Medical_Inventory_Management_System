package com.medistock.demo.dto;


import lombok.Data;

import java.util.List;


@Data
public class MultiSaleRequest {


    private List<SaleRequest> medicines;


}