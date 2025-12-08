package ro.techvault.content_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.techvault.content_service.models.Quest;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestRepository extends JpaRepository<Quest, UUID> {
    List<Quest> findByVaultId(Long vaultId);
}
