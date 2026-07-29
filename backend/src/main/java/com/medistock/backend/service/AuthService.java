package com.medistock.backend.service;

import com.medistock.backend.dto.request.LoginRequest;
import com.medistock.backend.dto.request.RegisterRequest;
import com.medistock.backend.dto.response.JwtResponse;

public interface AuthService {
    String register(RegisterRequest registerRequest);
    JwtResponse login(LoginRequest loginRequest);
}
