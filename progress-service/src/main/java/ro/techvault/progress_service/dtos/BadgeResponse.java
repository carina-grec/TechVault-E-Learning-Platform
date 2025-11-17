package ro.techvault.progress_service.dtos;

import ro.techvault.progress_service.enums.BadgeCriteriaType;

import java.util.UUID;

public record BadgeResponse(
        UUID id,
        String name,
        String description,
        String iconUrl,
        BadgeCriteriaType criteriaType,
        String criteriaValue
) {
}
