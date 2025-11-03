package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ro.techvault.authservice.enums.UserRole;

import java.util.UUID;

@AllArgsConstructor
@Getter
public class AuthResponse {
    String jwtToken;
    UUID userId;
    String email;
    UserRole role;
}
