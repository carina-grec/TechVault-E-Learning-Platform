package ro.techvault.user_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.user_service.enums.UserRole;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequestDTO {
    private String email;
    private String passwordHash;
    private UserRole role;
    private String displayName;
    private String username;
    private Integer age;
}
