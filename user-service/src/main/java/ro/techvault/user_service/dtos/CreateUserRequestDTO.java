package ro.techvault.user_service.dtos;

import lombok.Getter;
import ro.techvault.user_service.enums.UserRole;

@Getter
public class CreateUserRequestDTO {
    String email;
    String passwordHash;
    UserRole role;
    String username;
    int age;
}
