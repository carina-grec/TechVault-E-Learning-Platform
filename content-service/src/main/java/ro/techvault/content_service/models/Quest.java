package ro.techvault.content_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;
import ro.techvault.content_service.enums.ContentStatus;
import ro.techvault.content_service.enums.QuestType;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "quests")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "quest_type")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class Quest implements Persistable<UUID> {

    @Id
    private UUID id;
    @Transient
    private boolean isNew = true;

    @Column(nullable = false)
    private String title;

    @Column(name = "quest_order")
    private int order;

    @Column(nullable = false)
    private int xpValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentStatus status = ContentStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "quest_kind")
    private QuestType questType;

    @Column
    private String difficulty;

    @Column(name = "world_theme")
    private String worldTheme;

    @Column(name = "estimated_time")
    private String estimatedTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vault_id")
    private Vault vault;

    @ManyToMany
    @JoinTable(
            name = "quest_prerequisites",
            joinColumns = @JoinColumn(name = "quest_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    private Set<Quest> prerequisites;

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
