package com.medistock.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medistock.backend.dto.UserDTO;
import com.medistock.backend.entity.Role;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.RoleRepository;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    @Override
    public UserDTO getUserById(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return convertToDTO(user);

    }

    @Override
    public UserDTO updateUser(Integer id, UserDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found"));

        user.setRole(role);

        userRepository.save(user);

        return convertToDTO(user);

    }

    @Override
    public void deleteUser(Integer id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException("User not found");

        }

        userRepository.deleteById(id);

    }

    private UserDTO convertToDTO(User user) {

        UserDTO dto = new UserDTO();

        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        dto.setRoleId(user.getRole().getRoleId());
        dto.setRoleName(user.getRole().getRoleName());

        dto.setCreatedAt(user.getCreatedAt());

        return dto;

    }

}