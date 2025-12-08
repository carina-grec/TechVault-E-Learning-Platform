package ro.techvault.content_service.services;

import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.dtos.QuestResponse;
import ro.techvault.content_service.dtos.VaultCreateRequest;
import ro.techvault.content_service.dtos.VaultDetailResponse;
import ro.techvault.content_service.dtos.VaultResponse;
import ro.techvault.content_service.dtos.TestCaseDto;

import java.util.List;
import java.util.UUID;

public interface ContentService {
    VaultResponse createVault(VaultCreateRequest request);

    VaultResponse updateVault(Long vaultId, VaultCreateRequest request);

    void deleteVault(Long vaultId);

    List<VaultResponse> findVaults(String difficulty, String theme, Boolean featured, String search);

    VaultDetailResponse getVaultDetail(Long vaultId);

    QuestResponse createQuest(QuestCreateRequest request);

    QuestResponse updateQuest(UUID questId, QuestCreateRequest request);

    void deleteQuest(UUID questId);

    List<QuestResponse> getQuests(Long vaultId, String type, String difficulty);

    QuestResponse getQuestById(UUID questId);

    List<TestCaseDto> getTestCases(UUID questId);
}
