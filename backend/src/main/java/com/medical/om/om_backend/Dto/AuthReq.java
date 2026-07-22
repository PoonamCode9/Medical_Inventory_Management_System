package com.medical.om.om_backend.Dto;

import lombok.AllArgsConstructor; // Generates a constructor that takes ALL fields as arguments
import lombok.Getter;             // Generates getters for all fields

// This DTO is what the SERVER sends BACK to the client after a successful login.
// It only contains the JWT token string — nothing else.
//
// Why not send back the whole User object?
// → Security: never expose password hash, internal IDs, or sensitive fields to the client
// → The token itself already contains username + role — the client doesn't need more
@Getter
@AllArgsConstructor // Generates: public AuthReq(String token) { this.token = token; }
                    // We use this in AuthService to create the response in one line:
                    // return new AuthReq(token);
public class AuthReq {

    // The JWT token string — looks like "eyJhbGci..."
    // The client stores this and sends it on every future request
    // in the Authorization header: "Bearer eyJhbGci..."
    private String token;
}
