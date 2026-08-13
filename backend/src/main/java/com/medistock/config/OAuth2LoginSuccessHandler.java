package com.medistock.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.medistock.entity.User;
import com.medistock.service.JwtService;
import com.medistock.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    public OAuth2LoginSuccessHandler(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        if (email == null) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google account email not available"
            );
            return;
        }

        User user =
                userService.findOrCreateGoogleUser(name, email);

        String token =
                jwtService.generateToken(user.getEmail());

        String redirectUrl =
                "http://localhost:3000/oauth-success?token="
                + token
                + "&name="
                + java.net.URLEncoder.encode(
                        user.getName(),
                        java.nio.charset.StandardCharsets.UTF_8)
                + "&email="
                + java.net.URLEncoder.encode(
                        user.getEmail(),
                        java.nio.charset.StandardCharsets.UTF_8)
                + "&role="
                + java.net.URLEncoder.encode(
                        user.getRole().getRoleName(),
                        java.nio.charset.StandardCharsets.UTF_8);

        getRedirectStrategy().sendRedirect(
                request,
                response,
                redirectUrl
        );
    }
}