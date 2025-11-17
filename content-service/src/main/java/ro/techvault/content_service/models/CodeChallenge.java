package ro.techvault.content_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.techvault.content_service.enums.GradingStrategyType;

import java.util.List;

@Entity
@DiscriminatorValue("CODE_CHALLENGE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CodeChallenge extends Quest {

    @Lob
    @Column
    private String description;

    @Column
    private String language;

    @Lob
    private String starterCode;

    @Lob
    private String hints;

    @OneToMany(
            mappedBy = "codeChallenge",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TestCase> testCases;

    @Enumerated(EnumType.STRING)
    @Column
    private GradingStrategyType gradingStrategy = GradingStrategyType.UNIT_TEST; // Default it

}