package ro.techvault.content_service.dtos;

import java.util.Map;
import java.util.UUID;

public record QuestCreateRequest(
        UUID vaultId,
        String type,
        String title,
        int order,
        int xpValue,

        // A map to hold type-specific data
        // For CODE_CHALLENGE: {"description": "...", "language": "java", "starterCode": "..."}
        Map<String, Object> properties
) {}