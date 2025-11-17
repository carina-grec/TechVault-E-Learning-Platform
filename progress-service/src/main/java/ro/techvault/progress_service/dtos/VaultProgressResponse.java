package ro.techvault.progress_service.dtos;

import java.util.UUID;

public record VaultProgressResponse(
        UUID vaultId,
        int completedQuests,
        int totalQuests,
        int bestScore
) {
}
