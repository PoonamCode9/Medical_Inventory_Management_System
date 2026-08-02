package com.medicalinventory.backend.security.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.medicalinventory.backend.security.service.CustomUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    } 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        
        try {
            String email = jwtUtil.extractUsername(token);

            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if(jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch(ExpiredJwtException e) {
            logger.warn("JWT token has expired: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"TOKEN_EXPIRED\", \"message\": \"JWT token has expired\"}"); 
            return;
        } catch (JwtException e) {
            logger.warn("Invalid JWT token: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"INVALID_TOKEN\", \"message\": \"Invalid JWT token\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
