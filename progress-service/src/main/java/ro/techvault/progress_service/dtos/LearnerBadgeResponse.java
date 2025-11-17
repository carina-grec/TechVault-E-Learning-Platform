package ro.techvault.progress_service.dtos;

import java.sql.Timestamp;

public record LearnerBadgeResponse(
        BadgeResponse badge,
        Timestamp unlockedAt
) {
}
