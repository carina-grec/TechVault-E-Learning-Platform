package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.ContentStatus;

public record VaultCreateRequest(
        String title,
        String description,
        String theme,
        String slug,
        String category,
        String difficulty,
        String heroHighlight,
        String mascotName,
        Boolean featured,
        ContentStatus status,
        int displayOrder
) {}
