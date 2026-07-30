package com.medistock.backend.service;

import java.util.List;

import com.medistock.backend.dto.UserDTO;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Integer id);

    UserDTO updateUser(Integer id, UserDTO dto);

    void deleteUser(Integer id);
}