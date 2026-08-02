package com.medistock.demo.controller;



import com.medistock.demo.dto.GoogleLoginRequest;
import com.medistock.demo.service.GoogleAuthService;


import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class GoogleAuthController {



private final GoogleAuthService googleAuthService;



@PostMapping("/google")
public ResponseEntity<?> googleLogin(

        @RequestBody GoogleLoginRequest request

){


return ResponseEntity.ok(

        googleAuthService.login(
                request.getToken()
        )

);


}


}