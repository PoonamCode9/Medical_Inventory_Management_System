package com.medistock.backend.service;

import com.medistock.backend.dto.LoginRequest;
import com.medistock.backend.dto.LoginResponse;
import com.medistock.backend.entity.User;

public interface AuthService {

    User register(User user);

    LoginResponse login(LoginRequest request);
    

}
