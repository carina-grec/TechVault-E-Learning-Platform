package ro.techvault.user_service.dtos;

import java.util.Map;

public record UpdateProfileRequest(
        String displayName,
        String avatarUrl,
        String preferredMascot,
        Map<String, Object> settings
) {
}
