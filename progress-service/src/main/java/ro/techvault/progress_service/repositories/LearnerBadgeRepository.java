package ro.techvault.progress_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.progress_service.models.LearnerBadge;

import java.util.List;
import java.util.UUID;

public interface LearnerBadgeRepository extends JpaRepository<LearnerBadge, UUID> {
    List<LearnerBadge> findByLearnerId(UUID learnerId);
}
