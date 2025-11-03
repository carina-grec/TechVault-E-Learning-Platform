package ro.techvault.progress_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.techvault.progress_service.models.Submission;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findByLearnerId(UUID learnerId);
    List<Submission> findByLearnerIdAndQuestId(UUID learnerId, UUID questId);
}