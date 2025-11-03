package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "quest_completions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"learnerId", "questId"}))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class QuestCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID learnerId;

    @Column(nullable = false)
    private UUID questId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp completionDate;
}