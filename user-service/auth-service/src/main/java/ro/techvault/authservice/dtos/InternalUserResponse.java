package ro.techvault.authservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.techvault.authservice.enums.AccountStatus;
import ro.techvault.authservice.enums.UserRole;

import java.util.UUID;

public record InternalUserResponse(
        UUID id,
        String email,
        String passwordHash,
        UserRole role,
        AccountStatus status
) {
}