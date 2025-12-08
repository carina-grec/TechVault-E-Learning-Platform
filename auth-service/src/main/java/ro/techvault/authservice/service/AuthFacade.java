package ro.techvault.authservice.service;

import ro.techvault.authservice.dtos.AuthResponse;
import ro.techvault.authservice.dtos.AuthenticatedUserDto;
import ro.techvault.authservice.dtos.LoginRequest;
import ro.techvault.authservice.dtos.RegistrationRequest;

public interface AuthFacade {
    AuthResponse registerNewUser(RegistrationRequest request);

    AuthResponse login(LoginRequest request);

    AuthenticatedUserDto getCurrentUser(String authorizationHeader);

    void initiateConsent(String authorizationHeader, String parentEmail);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
