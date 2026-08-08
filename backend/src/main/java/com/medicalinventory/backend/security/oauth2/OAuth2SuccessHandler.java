package com.medicalinventory.backend.security.oauth2;

import com.medicalinventory.backend.entity.Role;
import com.medicalinventory.backend.entity.User;
import com.medicalinventory.backend.repository.RoleRepository;
import com.medicalinventory.backend.repository.UserRepository;
import com.medicalinventory.backend.security.jwt.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository, RoleRepository roleRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name != null ? name : "Google User");
            newUser.setPassword("");
            Role staffRole = roleRepository.findByRoleName("Staff")
                    .orElseThrow(() -> new RuntimeException("Default role 'Staff' not found in database"));
            newUser.setRole(staffRole);
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(user.getEmail());
        String role = user.getRole().getRoleName();

        String targetUrl = "http://localhost:5173/oauth2/redirect?token=" + token + "&role=" + role;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}