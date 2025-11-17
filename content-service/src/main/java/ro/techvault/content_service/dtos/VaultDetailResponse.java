package ro.techvault.content_service.dtos;

import java.util.List;

public record VaultDetailResponse(
        VaultResponse vault,
        List<QuestResponse> quests
) {
}
