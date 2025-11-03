package ro.techvault.content_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.techvault.content_service.enums.ContentStatus;

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
public abstract class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(name = "quest_order")
    private int order;

    @Column(nullable = false)
    private int xpValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentStatus status = ContentStatus.DRAFT;

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
}