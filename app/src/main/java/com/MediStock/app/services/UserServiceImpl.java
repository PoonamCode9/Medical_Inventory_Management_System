package com.MediStock.app.services;

import com.MediStock.app.dto.UserRequest;
import com.MediStock.app.dto.UserResponse;
import com.MediStock.app.entities.User;
import com.MediStock.app.enums.ActivityAction;
import com.MediStock.app.enums.ActivityModule;
import com.MediStock.app.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final ActivityLogService activityLogService;

    public UserServiceImpl(

            UserRepository userRepository,

            PasswordEncoder passwordEncoder,

            ActivityLogService activityLogService

    ) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.activityLogService = activityLogService;

    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    @Override
    public UserResponse getUserById(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        return mapToResponse(user);

    }

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already exists."
            );

        }

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(

                passwordEncoder.encode(
                        request.getPassword()
                )

        );

        user.setRoleId(request.getRoleId());

        User savedUser = userRepository.save(user);

        activityLogService.logActivity(

                ActivityModule.USER,

                ActivityAction.CREATED,

                savedUser.getUserId(),

                savedUser.getName(),

                "Created user: "
                        + savedUser.getName()
                        + " ("
                        + savedUser.getEmail()
                        + ")"

        );

        return mapToResponse(savedUser);

    }

    @Override
    public UserResponse updateUser(

            Long userId,

            UserRequest request

    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        if (!user.getEmail().equals(request.getEmail())

                &&

                userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email already exists."
            );

        }

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        if (request.getPassword() != null

                &&

                !request.getPassword().trim().isEmpty()) {

            user.setPassword(

                    passwordEncoder.encode(
                            request.getPassword()
                    )

            );

        }

        user.setRoleId(request.getRoleId());

        User updatedUser = userRepository.save(user);

        activityLogService.logActivity(

                ActivityModule.USER,

                ActivityAction.UPDATED,

                updatedUser.getUserId(),

                updatedUser.getName(),

                "Updated user: "
                        + updatedUser.getName()

        );

        return mapToResponse(updatedUser);

    }

    @Override
    public void deleteUser(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        activityLogService.logActivity(

                ActivityModule.USER,

                ActivityAction.DELETED,

                user.getUserId(),

                user.getName(),

                "Deleted user: "
                        + user.getName()

        );

        userRepository.delete(user);

    }

    private UserResponse mapToResponse(User user) {

        UserResponse response =
                new UserResponse();

        response.setUserId(
                user.getUserId()
        );

        response.setName(
                user.getName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setRoleId(
                user.getRoleId()
        );

        switch (user.getRoleId().intValue()) {

            case 1:

                response.setRoleName(
                        "ADMIN"
                );

                break;

            case 2:

                response.setRoleName(
                        "STAFF"
                );

                break;

            case 3:

                response.setRoleName(
                        "PHARMACIST"
                );

                break;

            default:

                response.setRoleName(
                        "UNKNOWN"
                );

        }

        return response;

    }

}