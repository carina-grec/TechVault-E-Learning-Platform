package ro.techvault.progress_service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.techvault.progress_service.dtos.AdminMetricsResponse;
import ro.techvault.progress_service.repositories.LearnerVaultProgressRepository;
import ro.techvault.progress_service.dtos.LearnerProgressSummaryResponse;
import ro.techvault.progress_service.dtos.VaultProgressResponse;
import ro.techvault.progress_service.dtos.AdminMetricsResponse;
import ro.techvault.progress_service.repositories.SubmissionRepository;
import ro.techvault.progress_service.models.Submission;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.LearnerVaultProgress;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LearnerProgressService {

        @Autowired
        private LearnerVaultProgressRepository vaultProgressRepository;

        @Autowired
        private SubmissionRepository submissionRepository;

        public LearnerProgressSummaryResponse getSummary(UUID learnerId) {
                List<VaultProgressResponse> vaults = getVaultProgress(learnerId);
                List<Submission> submissions = submissionRepository.findByLearnerId(learnerId);
                long completed = submissions.stream()
                                .filter(submission -> submission.getStatus() == SubmissionStatus.COMPLETED
                                                && submission.isSuccess())
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
                                vaults);
        }

        public List<VaultProgressResponse> getVaultProgress(UUID learnerId) {
                return vaultProgressRepository.findByLearnerId(learnerId).stream()
                                .map(progress -> new VaultProgressResponse(
                                                progress.getVaultId(),
                                                progress.getCompletedQuests(),
                                                progress.getTotalQuests(),
                                                progress.getBestScore()))
                                .collect(Collectors.toList());
        }

        public VaultProgressResponse getVaultProgress(UUID learnerId, UUID vaultId) {
                LearnerVaultProgress progress = vaultProgressRepository.findByLearnerIdAndVaultId(learnerId, vaultId)
                                .orElseThrow(() -> new RuntimeException("Progress not found"));
                return new VaultProgressResponse(
                                progress.getVaultId(),
                                progress.getCompletedQuests(),
                                progress.getTotalQuests(),
                                progress.getBestScore());
        }

        public AdminMetricsResponse getAdminMetrics() {
                long total = submissionRepository.count();
                long completed = submissionRepository.countByStatus(SubmissionStatus.COMPLETED);
                long pending = submissionRepository.countByStatus(SubmissionStatus.PENDING);
                Timestamp startOfDay = Timestamp
                                .from(LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC));
                long today = submissionRepository.countByTimestampAfter(startOfDay);
                return new AdminMetricsResponse(total, today, completed, pending);
        }
}
