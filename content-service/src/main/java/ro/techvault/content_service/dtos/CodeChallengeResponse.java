package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.ContentStatus;
import ro.techvault.content_service.enums.GradingStrategyType;

import java.util.UUID;


public record CodeChallengeResponse(
        // Quest fields
        UUID id,
        UUID vaultId,
        String title,
        String questType,
        int order,
        int xpValue,
        ContentStatus status,

        // CodeChallenge fields
        String description,
        String language,
        GradingStrategyType gradingStrategy
) {}