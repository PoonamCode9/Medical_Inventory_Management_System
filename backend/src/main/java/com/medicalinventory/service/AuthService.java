package com.medicalinventory.service;

import com.medicalinventory.dto.JwtResponse;
import com.medicalinventory.dto.LoginRequest;
import com.medicalinventory.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    JwtResponse login(LoginRequest request);
}