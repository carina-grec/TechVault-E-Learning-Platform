package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.authservice.enums.UserRole;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequestDTO {
    private String email;
    private String passwordHash;
    private UserRole role;
    private String displayName;
    private String username;
    private Integer age;
}
