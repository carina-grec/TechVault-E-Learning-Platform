package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.authservice.enums.UserRole;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {
    private String email;
    private String password;
    private UserRole role;
    private String displayName;
    private Integer age;
    private String username;
}
