package ro.techvault.progress_service.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.Submission;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findByLearnerId(UUID learnerId);
    List<Submission> findByLearnerIdAndQuestId(UUID learnerId, UUID questId);
    Page<Submission> findByLearnerId(UUID learnerId, Pageable pageable);
    Page<Submission> findByLearnerIdAndQuestId(UUID learnerId, UUID questId, Pageable pageable);
    Page<Submission> findByLearnerIdAndStatus(UUID learnerId, SubmissionStatus status, Pageable pageable);
    Page<Submission> findByLearnerIdAndQuestIdAndStatus(UUID learnerId, UUID questId, SubmissionStatus status, Pageable pageable);
    List<Submission> findTop5ByLearnerIdOrderByTimestampDesc(UUID learnerId);
    long countByStatus(SubmissionStatus status);
    long countByTimestampAfter(java.sql.Timestamp timestamp);
}
