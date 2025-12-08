package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.ContentStatus;

public record VaultResponse(
        Long id,
        String title,
        String description,
        String theme,
        String slug,
        String category,
        String difficulty,
        String heroHighlight,
        boolean featured,
        ContentStatus status,
        int displayOrder,
        int questCount) {
}
