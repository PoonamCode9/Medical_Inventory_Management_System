package com.medistock.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import com.medistock.service.UserService;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import com.medistock.service.JwtService;
import com.medistock.entity.Role;
import com.medistock.repository.RoleRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
private final RoleRepository roleRepository;
private final JwtService jwtService;
private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
              RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,JwtService jwtService) {

        this.userRepository = userRepository;
         this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService=jwtService;
    }

    @Override
    public User register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByRoleName(request.getRole())
        .orElseThrow(() -> new RuntimeException("Role Not Found"));

user.setRole(role);

        return userRepository.save(user);
    }

    @Override
public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid Email"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid Password");
    }

    String token = jwtService.generateToken(user.getEmail());

return new LoginResponse(
        token,
        user.getName(),
        user.getEmail(),
        user.getRole().getRoleName()
);
}
@Override
public User getUserById(Long id) {

    return userRepository.findById(id).orElse(null);

}
}