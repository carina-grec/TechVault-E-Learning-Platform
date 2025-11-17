package ro.techvault.authservice.dtos;

import ro.techvault.authservice.enums.UserRole;

import java.util.UUID;

public record AuthenticatedUserDto(
        UUID id,
        String email,
        String displayName,
        UserRole role
) {
}
