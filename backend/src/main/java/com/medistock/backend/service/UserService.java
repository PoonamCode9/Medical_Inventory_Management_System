package com.medistock.backend.service;

import com.medistock.backend.dto.request.UserRequest;
import com.medistock.backend.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse createUser(UserRequest userRequest);
    UserResponse updateUser(Integer userId, UserRequest userRequest);
    void deleteUser(Integer userId);
}
