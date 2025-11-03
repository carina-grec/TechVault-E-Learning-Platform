package ro.techvault.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.user_service.models.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}