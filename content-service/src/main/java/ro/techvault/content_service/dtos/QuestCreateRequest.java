package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.GradingStrategyType;

import java.util.UUID;

public record QuestCreateRequest(
        UUID vaultId,
        String type,
        String title,
        int order,
        int xpValue,
        String difficulty,
        String worldTheme,
        String estimatedTime,
        String description,
        String language,
        String starterCode,
        String hints,
        GradingStrategyType gradingStrategy
) {}
