package ro.techvault.progress_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.LearnerVaultProgress;
import ro.techvault.progress_service.models.Submission;
import ro.techvault.progress_service.repositories.LearnerVaultProgressRepository;
import ro.techvault.progress_service.repositories.SubmissionRepository;

import java.util.UUID;

@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private static final UUID SEEDED_LEARNER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID SEEDED_VAULT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final SubmissionRepository submissionRepository;
    private final LearnerVaultProgressRepository learnerVaultProgressRepository;

    public DataSeeder(SubmissionRepository submissionRepository,
            LearnerVaultProgressRepository learnerVaultProgressRepository) {
        this.submissionRepository = submissionRepository;
        this.learnerVaultProgressRepository = learnerVaultProgressRepository;
    }

    @Override
    public void run(String... args) {
        seedProgress();
        seedSubmissions();
    }

    private void seedProgress() {
        if (learnerVaultProgressRepository.count() > 0) {
            return;
        }

        LearnerVaultProgress progress = new LearnerVaultProgress();
        progress.setId(UUID.fromString("00000000-0000-0000-0000-000000000401"));
        progress.setLearnerId(SEEDED_LEARNER_ID);
        progress.setVaultId(SEEDED_VAULT_ID);
        progress.setCompletedQuests(3);
        progress.setTotalQuests(10);
        progress.setBestScore(98);
        learnerVaultProgressRepository.save(progress);
    }

    private void seedSubmissions() {
        if (submissionRepository.count() > 0) {
            return;
        }

        Submission submission = new Submission();
        submission.setLearnerId(SEEDED_LEARNER_ID);
        submission.setQuestId(UUID.fromString("00000000-0000-0000-0000-000000000101"));
        submission.setSubmittedCode("function solve() { return true; }");
        submission.setStatus(SubmissionStatus.COMPLETED);
        submission.setSuccess(true);
        submission.setStdout("All tests passed");
        submission.setResultsJson("{\"score\":98}");
        submissionRepository.save(submission);
    }
}
