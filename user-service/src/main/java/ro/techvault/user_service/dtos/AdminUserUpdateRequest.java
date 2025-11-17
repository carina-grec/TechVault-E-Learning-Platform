package ro.techvault.user_service.dtos;

import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.enums.UserRole;

public record AdminUserUpdateRequest(
        UserRole role,
        AccountStatus status,
        String displayName
) {
}
