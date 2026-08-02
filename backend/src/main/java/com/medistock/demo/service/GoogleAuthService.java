package com.medistock.demo.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.medistock.demo.config.GoogleTokenVerifier;
import com.medistock.demo.entity.Role;
import com.medistock.demo.entity.User;
import com.medistock.demo.repository.RoleRepository;
import com.medistock.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final GoogleTokenVerifier verifier;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final JwtService jwtService;

    public GoogleAuthResponse login(String idToken) {

        GoogleIdToken.Payload payload = verifier.verify(idToken);

        if (payload == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        String email = payload.getEmail();

        String fullName = (String) payload.get("name");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            Role staffRole = roleRepository
                    .findByRoleName("STAFF")
                    .orElseThrow(() ->
                            new RuntimeException("STAFF role not found"));

            user = new User();

            user.setEmail(email);

            user.setFullName(fullName);

            user.setUsername(
                    email.substring(0, email.indexOf("@"))
            );

            // Google users don't have phone/password initially
            user.setPhone("GOOGLE_" + System.currentTimeMillis());

            user.setPassword("");

            user.setRole(staffRole);

            user = userRepository.save(user);
        }

        String jwt = jwtService.generateToken(
                user.getEmail(),
                user.getRole().getRoleName()
        );

        return new GoogleAuthResponse(
                jwt,
                user.getRole().getRoleName(),
                user.getId()
        );
    }

    public static class GoogleAuthResponse {
        private final String token;
        private final String role;
        private final Long userId;

        public GoogleAuthResponse(String token, String role, Long userId) {
            this.token = token;
            this.role = role;
            this.userId = userId;
        }

        public String getToken() {
            return token;
        }

        public String getRole() {
            return role;
        }

        public Long getUserId() {
            return userId;
        }
    }
}