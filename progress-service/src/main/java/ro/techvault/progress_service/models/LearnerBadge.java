package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "learner_badges")
@Getter
@Setter
@NoArgsConstructor
public class LearnerBadge implements Persistable<UUID> {

    @Id
    private UUID id;
    @Transient
    private boolean isNew = true;

    @Column(nullable = false)
    private UUID learnerId;

    @Column(nullable = false)
    private UUID badgeId;

    @Column(nullable = false)
    private Timestamp unlockedAt;

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
