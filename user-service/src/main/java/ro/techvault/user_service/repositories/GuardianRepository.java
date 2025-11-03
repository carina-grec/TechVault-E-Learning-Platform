package ro.techvault.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.user_service.models.Guardian;

import java.util.UUID;

public interface GuardianRepository extends JpaRepository<Guardian, UUID> {
}
