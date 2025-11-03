package ro.techvault.progress_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.progress_service.models.Badge;

import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {}