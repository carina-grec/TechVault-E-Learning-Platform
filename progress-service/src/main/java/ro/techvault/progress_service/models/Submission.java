package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import ro.techvault.progress_service.enums.SubmissionStatus;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "submissions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private UUID learnerId;

    @Column(nullable = false, updatable = false)
    private UUID questId;

    @Lob
    @Column(nullable = false)
    private String submittedCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    private boolean isSuccess;

    @Lob
    private String stdout;

    @Lob
    private String stderr;

    @Lob
    private String resultsJson;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Timestamp timestamp;

}