package com.medistock.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.medistock.dto.RegisterRequest;
import com.medistock.entity.User;
import com.medistock.service.UserService;
import com.medistock.dto.ForgotPasswordRequest;
import com.medistock.dto.LoginRequest;
import com.medistock.dto.LoginResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.security.Principal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import com.medistock.dto.UpdateProfileRequest;
import com.medistock.dto.ResetPasswordRequest;
import com.medistock.dto.ResetPasswordTokenRequest;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }
    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    return userService.login(request);
}
@GetMapping("/profile/{id}")
public User getProfile(@PathVariable Long id) {
    return userService.getUserById(id);
}
@GetMapping("/profile")
public ResponseEntity<User> getLoggedInUser(Principal principal) {
    User user = userService.getProfile(principal.getName());
    return ResponseEntity.ok(user);
}
@PutMapping("/profile")
public ResponseEntity<User> updateProfile(
        Principal principal,
        @RequestBody UpdateProfileRequest request) {
    User updatedUser =
            userService.updateProfile(principal.getName(), request);
    return ResponseEntity.ok(updatedUser);
}
@PostMapping("/reset-password")
public ResponseEntity<String> resetPassword(
        Principal principal,
        @RequestBody ResetPasswordRequest request) {
    userService.resetPassword(principal.getName(), request);
    return ResponseEntity.ok("Password Updated Successfully");
}
@PostMapping("/forgot-password")
public ResponseEntity<String> forgotPassword(
        @RequestBody ForgotPasswordRequest request) {

    userService.forgotPassword(request);

    return ResponseEntity.ok("Reset token generated successfully");
}
@PostMapping("/reset-password-token")
public ResponseEntity<String> resetPasswordWithToken(
        @RequestBody ResetPasswordTokenRequest request) {

    userService.resetPasswordWithToken(request);

    return ResponseEntity.ok("Password reset successfully");
}
}