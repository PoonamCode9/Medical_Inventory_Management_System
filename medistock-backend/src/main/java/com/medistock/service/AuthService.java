package com.medistock.service;

import com.medistock.dto.LoginRequest;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterRequest request){

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        return "User Registered Successfully";

    }

    public User login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail()).orElse(null);

    if (user == null) {
        return null;
    }

    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return user;
    }

    return null;
}

}