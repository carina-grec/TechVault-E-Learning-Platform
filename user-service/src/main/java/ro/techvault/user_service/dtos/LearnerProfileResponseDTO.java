package ro.techvault.user_service.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
public class LearnerProfileResponseDTO {
    UUID id;
    String username;
    int xp;
    int level;
    String avatarUrl;
    int currentStreak;
}
