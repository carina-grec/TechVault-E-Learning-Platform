package ro.techvault.user_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "guardians")
@PrimaryKeyJoinColumn(name = "user_id")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Guardian extends User {

    private String firstName;
    private String lastName;

    @ManyToMany
    @JoinTable(
            name = "guardian_learners",
            joinColumns = @JoinColumn(name = "guardian_id"),
            inverseJoinColumns = @JoinColumn(name = "learner_id"))
    private Set<Learner> monitoredLearners;
}
