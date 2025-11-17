package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AuthResponse {
    private String token;
    private AuthenticatedUserDto user;
}
