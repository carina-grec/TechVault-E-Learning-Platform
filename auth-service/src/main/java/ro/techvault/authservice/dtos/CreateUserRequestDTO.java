package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ro.techvault.authservice.enums.UserRole;

@Getter
@AllArgsConstructor
public class CreateUserRequestDTO {
    String email;
    String passwordHash;
    UserRole role;
    String username;
    int age;
}
