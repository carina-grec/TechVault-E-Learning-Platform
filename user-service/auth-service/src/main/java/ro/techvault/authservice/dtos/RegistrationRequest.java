package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ro.techvault.authservice.enums.UserRole;

@Getter
@AllArgsConstructor
public class RegistrationRequest {
    String email;
    String password;
    UserRole role;
    int age;
    String username;
}
