package ro.techvault.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.techvault.user_service.models.Admin;

import java.util.Optional;
import java.util.UUID;

public interface AdminRepository extends JpaRepository<Admin, UUID> {
}