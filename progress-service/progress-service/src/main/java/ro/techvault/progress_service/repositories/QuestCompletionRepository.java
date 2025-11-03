package ro.techvault.progress_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.techvault.progress_service.models.QuestCompletion;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestCompletionRepository extends JpaRepository<QuestCompletion, UUID> {

    List<QuestCompletion> findByLearnerId(UUID learnerId);
    boolean existsByLearnerIdAndQuestId(UUID learnerId, UUID questId);
}