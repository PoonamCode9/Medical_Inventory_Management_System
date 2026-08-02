package com.medicalinventory.service;

import com.medicalinventory.entity.User;
import java.util.List;

public interface UserService {

    Long getUserCount();

    List<User> getAllUsers();

    // Edit Profile
    User updateUser(Long id, User user);

    // Change Password
    void changePassword(
            Long id,
            String currentPassword,
            String newPassword);
}
