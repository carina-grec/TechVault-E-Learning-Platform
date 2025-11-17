package ro.techvault.user_service.dtos;

import java.util.UUID;

public record GuardianLearnerResponse(
        UUID id,
        String displayName,
        String username,
        int xp,
        int level,
        int currentStreak
) {
}
