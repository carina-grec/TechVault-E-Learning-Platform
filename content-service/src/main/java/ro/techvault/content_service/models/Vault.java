package ro.techvault.content_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;
import ro.techvault.content_service.enums.ContentStatus;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vaults")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Transient
    private boolean isNew = true;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    private String theme;

    @Column(unique = true)
    private String slug;

    private String category;

    private String difficulty;

    @Column(name = "hero_highlight")
    private String heroHighlight;

    @Column(name = "mascot_name")
    private String mascotName;

    @Column(name = "is_featured")
    private boolean featured;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentStatus status = ContentStatus.DRAFT;

    @Column(nullable = false, name = "display_order")
    private int displayOrder = 0;

    @OneToMany(mappedBy = "vault", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("order ASC")
    private List<Quest> quests;

    @PostLoad
    @PostPersist
    private void markNotNew() {
        // this.isNew = false;
    }
}
