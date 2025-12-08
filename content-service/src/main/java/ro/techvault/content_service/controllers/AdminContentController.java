package ro.techvault.content_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.dtos.QuestResponse;
import ro.techvault.content_service.dtos.VaultCreateRequest;
import ro.techvault.content_service.dtos.VaultResponse;
import ro.techvault.content_service.services.ContentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminContentController {

    @Autowired
    private ContentService contentService;

    @PostMapping("/vaults")
    public ResponseEntity<VaultResponse> createVault(@RequestBody VaultCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createVault(request));
    }

    @PutMapping("/vaults/{vaultId}")
    public ResponseEntity<VaultResponse> updateVault(
            @PathVariable Long vaultId,
            @RequestBody VaultCreateRequest request) {
        return ResponseEntity.ok(contentService.updateVault(vaultId, request));
    }

    @DeleteMapping("/vaults/{vaultId}")
    public ResponseEntity<Void> deleteVault(@PathVariable Long vaultId) {
        contentService.deleteVault(vaultId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vaults")
    public ResponseEntity<List<VaultResponse>> listVaults(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(contentService.findVaults(difficulty, theme, featured, search));
    }

    @PostMapping("/quests")
    public ResponseEntity<QuestResponse> createQuest(@RequestBody QuestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentService.createQuest(request));
    }

    @PutMapping("/quests/{questId}")
    public ResponseEntity<QuestResponse> updateQuest(
            @PathVariable UUID questId,
            @RequestBody QuestCreateRequest request) {
        return ResponseEntity.ok(contentService.updateQuest(questId, request));
    }

    @DeleteMapping("/quests/{questId}")
    public ResponseEntity<Void> deleteQuest(@PathVariable UUID questId) {
        contentService.deleteQuest(questId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quests")
    public ResponseEntity<List<QuestResponse>> listQuests(
            @RequestParam(required = false) Long vaultId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(contentService.getQuests(vaultId, type, difficulty));
    }
}
