package com.medistock.service;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;

public interface UserService {

    User register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    User getUserById(Long id);

}