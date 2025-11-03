package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ro.techvault.authservice.enums.AccountStatus;
import ro.techvault.authservice.enums.UserRole;

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