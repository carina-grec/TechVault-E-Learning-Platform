package ro.techvault.progress_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ro.techvault.progress_service.enums.BadgeCriteriaType;

import java.util.UUID;

@Entity
@Table(name = "badges")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

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
}