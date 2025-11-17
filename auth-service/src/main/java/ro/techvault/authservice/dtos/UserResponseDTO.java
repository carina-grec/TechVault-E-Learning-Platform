package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.authservice.enums.AccountStatus;
import ro.techvault.authservice.enums.UserRole;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private UUID id;
    private String email;
    private UserRole role;
    private String displayName;
    private AccountStatus status;
    private Timestamp createdAt;
}
