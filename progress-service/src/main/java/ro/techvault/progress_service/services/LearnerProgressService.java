package ro.techvault.progress_service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.techvault.progress_service.dtos.AdminMetricsResponse;
import ro.techvault.progress_service.dtos.BadgeResponse;
import ro.techvault.progress_service.dtos.LearnerBadgeResponse;
import ro.techvault.progress_service.dtos.LearnerProgressSummaryResponse;
import ro.techvault.progress_service.dtos.VaultProgressResponse;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.Badge;
import ro.techvault.progress_service.models.LearnerBadge;
import ro.techvault.progress_service.models.LearnerVaultProgress;
import ro.techvault.progress_service.models.Submission;
import ro.techvault.progress_service.repositories.BadgeRepository;
import ro.techvault.progress_service.repositories.LearnerBadgeRepository;
import ro.techvault.progress_service.repositories.LearnerVaultProgressRepository;
import ro.techvault.progress_service.repositories.SubmissionRepository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LearnerProgressService {

    @Autowired
    private LearnerVaultProgressRepository vaultProgressRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private LearnerBadgeRepository learnerBadgeRepository;

    public LearnerProgressSummaryResponse getSummary(UUID learnerId) {
        List<VaultProgressResponse> vaults = getVaultProgress(learnerId);
        List<Submission> submissions = submissionRepository.findByLearnerId(learnerId);
        long completed = submissions.stream()
                .filter(submission -> submission.getStatus() == SubmissionStatus.COMPLETED && submission.isSuccess())
                .count();
        int xp = (int) (completed * 50);
        int level = Math.max(1, xp / 500 + 1);
        int streak = Math.toIntExact(Math.min(30, completed));
        return new LearnerProgressSummaryResponse(
                level,
                xp,
                streak,
                (int) completed,
                submissions.size(),
                vaults
        );
    }

    public List<VaultProgressResponse> getVaultProgress(UUID learnerId) {
        return vaultProgressRepository.findByLearnerId(learnerId).stream()
                .map(progress -> new VaultProgressResponse(
                        progress.getVaultId(),
                        progress.getCompletedQuests(),
                        progress.getTotalQuests(),
                        progress.getBestScore()
                ))
                .collect(Collectors.toList());
    }

    public VaultProgressResponse getVaultProgress(UUID learnerId, UUID vaultId) {
        LearnerVaultProgress progress = vaultProgressRepository.findByLearnerIdAndVaultId(learnerId, vaultId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));
        return new VaultProgressResponse(
                progress.getVaultId(),
                progress.getCompletedQuests(),
                progress.getTotalQuests(),
                progress.getBestScore()
        );
    }

    public List<BadgeResponse> getBadgeCatalog() {
        return badgeRepository.findAll().stream()
                .map(this::mapBadge)
                .collect(Collectors.toList());
    }

    public List<LearnerBadgeResponse> getLearnerBadges(UUID learnerId) {
        Map<UUID, Badge> badgeMap = badgeRepository.findAll().stream()
                .collect(Collectors.toMap(Badge::getId, badge -> badge));
        return learnerBadgeRepository.findByLearnerId(learnerId).stream()
                .map(entry -> new LearnerBadgeResponse(
                        mapBadge(badgeMap.get(entry.getBadgeId())),
                        entry.getUnlockedAt()
                ))
                .collect(Collectors.toList());
    }

    public AdminMetricsResponse getAdminMetrics() {
        long total = submissionRepository.count();
        long completed = submissionRepository.countByStatus(SubmissionStatus.COMPLETED);
        long pending = submissionRepository.countByStatus(SubmissionStatus.PENDING);
        Timestamp startOfDay = Timestamp.from(LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC));
        long today = submissionRepository.countByTimestampAfter(startOfDay);
        return new AdminMetricsResponse(total, today, completed, pending);
    }

    private BadgeResponse mapBadge(Badge badge) {
        if (badge == null) {
            return null;
        }
        return new BadgeResponse(
                badge.getId(),
                badge.getName(),
                badge.getDescription(),
                badge.getIconUrl(),
                badge.getCriteriaType(),
                badge.getCriteriaValue()
        );
    }
}
