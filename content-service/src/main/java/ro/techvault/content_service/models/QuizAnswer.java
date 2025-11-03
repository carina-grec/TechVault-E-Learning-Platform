package ro.techvault.content_service.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "quiz_answers")
@AllArgsConstructor()
@NoArgsConstructor()
@Getter
@Setter()
public class QuizAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean isCorrect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private QuizQuestion question;

}