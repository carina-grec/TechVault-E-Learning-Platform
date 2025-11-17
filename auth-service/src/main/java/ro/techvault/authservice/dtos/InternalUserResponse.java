package ro.techvault.authservice.dtos;

import ro.techvault.authservice.enums.AccountStatus;
import ro.techvault.authservice.enums.UserRole;

import java.util.UUID;

public record InternalUserResponse(
        UUID id,
        String email,
        String passwordHash,
        UserRole role,
        String displayName,
        AccountStatus status
) {
}
