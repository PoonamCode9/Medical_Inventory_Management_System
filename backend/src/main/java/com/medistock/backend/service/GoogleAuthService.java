package com.medistock.backend.service;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.medistock.backend.dto.GoogleLoginResponse;
import com.medistock.backend.entity.User;
import com.medistock.backend.repository.UserRepository;
import com.medistock.backend.security.JwtService;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final String googleClientId;

    public GoogleAuthService(
            UserRepository userRepository,
            JwtService jwtService,
            @Qualifier("googleClientId") String googleClientId) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.googleClientId = googleClientId;
    }

    public GoogleLoginResponse login(String idTokenString) throws Exception {

        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Access Denied. User not registered.");
        }

        String jwt = jwtService.generateToken(user.getEmail());

        return new GoogleLoginResponse(
                jwt,
                user.getRole().getRoleName(),
                user.getFullName(),
                user.getEmail()
        );
    }
}