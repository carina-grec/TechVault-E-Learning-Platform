package ro.techvault.content_service.dtos;

public record VaultCreateRequest(
        String title,
        String description,
        String theme,
        int displayOrder
) {}