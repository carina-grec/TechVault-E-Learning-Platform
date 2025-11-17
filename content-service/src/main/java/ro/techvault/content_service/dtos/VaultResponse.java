package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.ContentStatus;

import java.util.UUID;

public record VaultResponse(
        UUID id,
        String title,
        String description,
        String theme,
        String slug,
        String category,
        String difficulty,
        String heroHighlight,
        String mascotName,
        boolean featured,
        ContentStatus status,
        int displayOrder,
        int questCount
) {}
