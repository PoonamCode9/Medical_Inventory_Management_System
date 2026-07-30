package com.medistock.backend.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiError {

    private LocalDateTime timestamp;

    private Integer status;

    private String error;

    private String message;

    private String path;
}