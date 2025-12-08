package ro.techvault.content_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("LESSON")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Lesson extends Quest {

    @Lob
    @Column
    private String content;

    @Column(name = "video_url")
    private String videoUrl;
}
