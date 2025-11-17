package ro.techvault.progress_service.dtos;

import java.util.List;

public record LearnerProgressSummaryResponse(
        int level,
        int xp,
        int streak,
        int completedQuests,
        int totalQuests,
        List<VaultProgressResponse> vaults
) {
}
