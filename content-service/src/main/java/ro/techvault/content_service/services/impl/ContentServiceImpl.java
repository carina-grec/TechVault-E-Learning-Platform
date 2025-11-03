package ro.techvault.content_service.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.techvault.content_service.dtos.*;
import ro.techvault.content_service.factory.QuestFactory;
import ro.techvault.content_service.models.CodeChallenge;
import ro.techvault.content_service.models.Quest;
import ro.techvault.content_service.models.Quiz;
import ro.techvault.content_service.models.Vault;
import ro.techvault.content_service.repositories.QuestRepository;
import ro.techvault.content_service.repositories.VaultRepository;
import ro.techvault.content_service.services.ContentService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentServiceImpl implements ContentService {

    @Autowired
    private VaultRepository vaultRepository;

    @Autowired
    private QuestRepository questRepository;

    @Autowired
    private QuestFactory questFactory;

    @Override
    public VaultResponse createVault(VaultCreateRequest request) {
        Vault vault = new Vault();
        vault.setTitle(request.title());
        vault.setDescription(request.description());
        vault.setTheme(request.theme());
        vault.setDisplayOrder(request.displayOrder());

        Vault savedVault = vaultRepository.save(vault);

        return new VaultResponse(
                savedVault.getId(),
                savedVault.getTitle(),
                savedVault.getDescription(),
                savedVault.getTheme(),
                savedVault.getStatus(),
                savedVault.getDisplayOrder()
        );
    }

    @Override
    public QuestResponse createQuest(QuestCreateRequest request) {
        Vault vault = vaultRepository.findById(request.vaultId())
                .orElseThrow(() -> new RuntimeException("Vault not found with id: " + request.vaultId()));

        Quest quest = questFactory.createQuest(request);
        quest.setVault(vault);
        Quest savedQuest = questRepository.save(quest);

        // Start with the common fields
        QuestResponse.QuestResponseBuilder responseBuilder = QuestResponse.builder()
                .id(savedQuest.getId())
                .vaultId(savedQuest.getVault().getId())
                .title(savedQuest.getTitle())
                .questType(savedQuest.getClass().getSimpleName()) // e.g., "CodeChallenge"
                .order(savedQuest.getOrder())
                .xpValue(savedQuest.getXpValue())
                .status(savedQuest.getStatus());

        if (savedQuest instanceof CodeChallenge challenge) {
            responseBuilder
                    .description(challenge.getDescription())
                    .language(challenge.getLanguage())
                    .gradingStrategy(challenge.getGradingStrategy());
        }

        return responseBuilder.build();
    }

    @Override
    public List<VaultResponse> getAllVaults() {
        return vaultRepository.findAll().stream()
                .map(vault -> new VaultResponse(
                        vault.getId(),
                        vault.getTitle(),
                        vault.getDescription(),
                        vault.getTheme(),
                        vault.getStatus(),
                        vault.getDisplayOrder()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public VaultResponse getVaultById(UUID vaultId) {
        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException("Vault not found with id: " + vaultId));

        return new VaultResponse(
                vault.getId(),
                vault.getTitle(),
                vault.getDescription(),
                vault.getTheme(),
                vault.getStatus(),
                vault.getDisplayOrder()
        );
    }
}