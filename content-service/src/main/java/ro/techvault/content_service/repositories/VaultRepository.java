package ro.techvault.content_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.techvault.content_service.models.Vault;

import java.util.UUID;

@Repository
public interface VaultRepository extends JpaRepository<Vault, UUID> {}