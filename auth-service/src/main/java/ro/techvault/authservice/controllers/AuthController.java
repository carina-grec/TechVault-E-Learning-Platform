package ro.techvault.authservice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.authservice.dtos.AuthResponse;
import ro.techvault.authservice.dtos.AuthenticatedUserDto;
import ro.techvault.authservice.dtos.LoginRequest;
import ro.techvault.authservice.dtos.RegistrationRequest;
import ro.techvault.authservice.service.AuthFacade;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegistrationRequest request) {
        AuthResponse response = authFacade.registerNewUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authFacade.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthenticatedUserDto> me(@RequestHeader("Authorization") String authorization) {
        return ResponseEntity.ok(authFacade.getCurrentUser(authorization));
    }

    @PostMapping("/consent-request")
    public ResponseEntity<Void> initiateConsent(
            @RequestHeader("Authorization") String authorization,
            @RequestBody ro.techvault.authservice.dtos.ConsentRequest request) {
        authFacade.initiateConsent(authorization, request.getParentEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody ro.techvault.authservice.dtos.RefreshTokenRequest request) {
        return ResponseEntity.ok(authFacade.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody ro.techvault.authservice.dtos.RefreshTokenRequest request) {
        authFacade.logout(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }
}
