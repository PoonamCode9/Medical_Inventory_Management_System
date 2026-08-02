package com.medistock.demo.dto;


import lombok.Data;


@Data
public class StockUpdateRequest {


    private Integer quantity;


    private String operation;


}