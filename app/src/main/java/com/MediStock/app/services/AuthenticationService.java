package com.MediStock.app.services;

import com.MediStock.app.dto.LoginResponse;
import com.MediStock.app.entities.Role;
import com.MediStock.app.entities.User;
import com.MediStock.app.repositories.RoleRepository;
import com.MediStock.app.repositories.UserRepository;
import com.MediStock.app.security.JwtGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtGenerator jwtGenerator;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            JwtGenerator jwtGenerator,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtGenerator = jwtGenerator;
        this.passwordEncoder = passwordEncoder;

    }

    public String registerUser(User newUser) {

        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        newUser.setPassword(
                passwordEncoder.encode(newUser.getPassword())
        );

        userRepository.save(newUser);

        return "User registered successfully!";

    }

    public LoginResponse loginUser(
            String email,
            String rawPassword
    ) {

        Optional<User> foundUser =
                userRepository.findByEmail(email);

        if (foundUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password!");
        }

        User user = foundUser.get();

        if (!passwordEncoder.matches(
                rawPassword,
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid email or password!");
        }

        Role role = roleRepository
                .findById(user.getRoleId())
                .orElseThrow(() ->
                        new RuntimeException("Role not found.")
                );

        String token = jwtGenerator.generateToken(
                user.getEmail(),
                role.getRoleName()
        );

        return new LoginResponse(

                user.getUserId(),

                token,

                user.getEmail(),

                role.getRoleName(),

                user.getName()

        );

    }

}