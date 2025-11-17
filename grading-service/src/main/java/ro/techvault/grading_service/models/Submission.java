package ro.techvault.grading_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "submissions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Submission {

    @Id
    private UUID id; // We don't generate it, we only find it

    private String status;
    private boolean isSuccess;
    private Double score;
    @Lob
    private String stdout;
    @Lob
    private String stderr;
    @Lob
    private String resultsJson;

}
