package ro.techvault.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.user_service.models.Learner;

import java.util.Optional;
import java.util.UUID;

public interface LearnerRepository extends JpaRepository<Learner, UUID> {
    Optional<Learner> findByUsername(String username);
    Optional<Learner> findByUsernameIgnoreCase(String username);
    Boolean existsByUsername(String username);
}
