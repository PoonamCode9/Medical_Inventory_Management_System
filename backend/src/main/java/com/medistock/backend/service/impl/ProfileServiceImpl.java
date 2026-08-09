package com.medistock.backend.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medistock.backend.dto.ChangePasswordRequest;
import com.medistock.backend.dto.ProfileResponse;
import com.medistock.backend.dto.UpdateProfileRequest;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.service.ProfileService;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileServiceImpl(UserRepository userRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ProfileResponse getProfile(String email) {

        User user = findUserByEmail(email);

        return new ProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getRoleName(),
                user.getCreatedAt().toString()
        );
    }

    @Override
    public ProfileResponse updateProfile(String email,
                                         UpdateProfileRequest request) {

        User user = findUserByEmail(email);

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return new ProfileResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getRoleName(),
                user.getCreatedAt().toString()
        );
    }

    @Override
    public void changePassword(String email,
                               ChangePasswordRequest request) {

        User user = findUserByEmail(email);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    private User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

}
