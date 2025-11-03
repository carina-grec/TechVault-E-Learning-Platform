package ro.techvault.content_service.services;

import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.dtos.QuestResponse;
import ro.techvault.content_service.dtos.VaultCreateRequest;
import ro.techvault.content_service.dtos.VaultResponse;

import java.util.List;
import java.util.UUID;

public interface ContentService {
    VaultResponse createVault(VaultCreateRequest request);
    QuestResponse createQuest(QuestCreateRequest request);

    List<VaultResponse> getAllVaults();
    VaultResponse getVaultById(UUID vaultId);
}