package ro.techvault.content_service.dtos;

import ro.techvault.content_service.enums.ContentStatus;

import java.util.UUID;

public record VaultResponse(
        UUID id,
        String title,
        String description,
        String theme,
        ContentStatus status,
        int displayOrder
) {}