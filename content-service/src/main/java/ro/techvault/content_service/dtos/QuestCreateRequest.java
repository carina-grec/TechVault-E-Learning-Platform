package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.GradingStrategyType;

import java.util.List;
import java.util.UUID;

public record QuestCreateRequest(
        Long vaultId,
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
        String content,
        String videoUrl,
        GradingStrategyType gradingStrategy,
        List<TestCaseDto> testCases) {
}
