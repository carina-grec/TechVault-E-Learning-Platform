package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;

import java.util.UUID;

@Entity
@Table(name = "learner_vault_progress")
@Getter
@Setter
@NoArgsConstructor
public class LearnerVaultProgress implements Persistable<UUID> {

    @Id
    private UUID id;
    @Transient
    private boolean isNew = true;

    @Column(nullable = false)
    private UUID learnerId;

    @Column(nullable = false)
    private UUID vaultId;

    @Column(nullable = false)
    private int completedQuests;

    @Column(nullable = false)
    private int totalQuests;

    @Column
    private int bestScore;

    @Override
    public boolean isNew() {
        return isNew || id == null;
    }

    @PostLoad
    @PostPersist
    private void markNotNew() {
        this.isNew = false;
    }

    @PrePersist
    private void ensureId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
}
