package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;
import ro.techvault.progress_service.enums.BadgeCriteriaType;

import java.util.UUID;

@Entity
@Table(name = "badges")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Badge implements Persistable<UUID> {

    @Id
    private UUID id;
    @Transient
    private boolean isNew = true;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeCriteriaType criteriaType;

    @Column(nullable = false)
    private String criteriaValue;

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
