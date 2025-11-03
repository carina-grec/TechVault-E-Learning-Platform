package ro.techvault.user_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.enums.UserRole;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserResponseDTO {
    UUID id;
    String email;
    UserRole role;
    AccountStatus status;
    Timestamp createdAt;

}
