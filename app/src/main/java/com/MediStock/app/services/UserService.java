package com.MediStock.app.services;

import com.MediStock.app.dto.UserRequest;
import com.MediStock.app.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);

    UserResponse createUser(UserRequest request);

    UserResponse updateUser(
            Long userId,
            UserRequest request
    );

    void deleteUser(Long userId);

}