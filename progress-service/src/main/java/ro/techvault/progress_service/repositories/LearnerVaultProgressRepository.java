package ro.techvault.progress_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.progress_service.models.LearnerVaultProgress;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LearnerVaultProgressRepository extends JpaRepository<LearnerVaultProgress, UUID> {
    List<LearnerVaultProgress> findByLearnerId(UUID learnerId);
    Optional<LearnerVaultProgress> findByLearnerIdAndVaultId(UUID learnerId, UUID vaultId);
}
