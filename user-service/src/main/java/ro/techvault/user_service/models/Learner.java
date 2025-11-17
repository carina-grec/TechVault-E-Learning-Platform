package ro.techvault.user_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "learners")
@PrimaryKeyJoinColumn(name = "user_id")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Learner extends User {

    @Column(unique = true, nullable = false)
    private String username;

    private int age;
    private int xp;
    private int level;
    private int currentStreak;
    private Date lastActivityDate;

    @ManyToMany(mappedBy = "monitoredLearners")
    private Set<Guardian> guardians;

}
