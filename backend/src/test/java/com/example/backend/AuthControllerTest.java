package com.example.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthController controller;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        controller = new AuthController(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void registerEndpointShouldReturnSuccess() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(new User(1, "John Doe", "john@example.com", "hashed_password", "admin"));

        ResponseEntity<Map<String, Object>> response = controller.register(Map.of(
                "name", "John Doe",
                "email", "john@example.com",
                "password", "secret123",
                "role", "admin"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("success", true);
        assertThat(response.getBody()).containsEntry("message", "Registration successful");
    }

    @Test
    void loginEndpointShouldReturnSuccess() {
        User testUser = new User(1, "John Doe", "john@example.com", "hashed_password", "admin");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("secret123", "hashed_password")).thenReturn(true);

        ResponseEntity<Map<String, Object>> response = controller.login(Map.of(
                "email", "john@example.com",
                "password", "secret123"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("success", true);
        assertThat(response.getBody()).containsEntry("message", "Login successful");
    }

    @Test
    void loginEndpointShouldReturnJwtToken() {
        User testUser = new User(1, "John Doe", "john@example.com", "hashed_password", "admin");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("secret123", "hashed_password")).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn("mock-jwt-token");

        ResponseEntity<Map<String, Object>> response = controller.login(Map.of(
                "email", "john@example.com",
                "password", "secret123"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("token", "mock-jwt-token");
        assertThat(response.getBody()).containsEntry("tokenType", "Bearer");
    }
}
