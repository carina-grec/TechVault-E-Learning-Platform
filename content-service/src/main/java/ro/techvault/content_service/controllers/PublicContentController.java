package ro.techvault.content_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.content_service.dtos.QuestResponse;
import ro.techvault.content_service.dtos.VaultDetailResponse;
import ro.techvault.content_service.dtos.VaultResponse;
import ro.techvault.content_service.services.ContentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PublicContentController {

    @Autowired
    private ContentService contentService;

    @GetMapping("/vaults")
    public ResponseEntity<List<VaultResponse>> getVaults(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(contentService.findVaults(difficulty, theme, featured, search));
    }

    @GetMapping("/vaults/{vaultId}")
    public ResponseEntity<VaultDetailResponse> getVault(@PathVariable UUID vaultId) {
        return ResponseEntity.ok(contentService.getVaultDetail(vaultId));
    }

    @GetMapping("/quests")
    public ResponseEntity<List<QuestResponse>> getQuests(
            @RequestParam(required = false) UUID vaultId,
            @RequestParam(required = false) String difficulty
    ) {
        return ResponseEntity.ok(contentService.getQuests(vaultId, null, difficulty));
    }

    @GetMapping("/quests/{questId}")
    public ResponseEntity<QuestResponse> getQuest(@PathVariable UUID questId) {
        return ResponseEntity.ok(contentService.getQuestById(questId));
    }
}
