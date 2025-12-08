package ro.techvault.user_service.dtos;

import ro.techvault.user_service.enums.UserRole;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record UserProfileResponse(
                UUID id,
                String email,
                UserRole role,
                String displayName,
                Integer xp,
                Integer level,
                Integer currentStreak,
                String avatarUrl,
                String preferredMascot,
                Map<String, Object> settings,
                List<UUID> linkedLearners,
                List<UUID> linkedGuardians,
                Instant createdAt,
                ro.techvault.user_service.enums.AccountStatus status) {
}
