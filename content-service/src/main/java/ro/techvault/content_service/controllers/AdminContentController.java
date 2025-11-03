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
@RequestMapping("/api/admin/content")
public class AdminContentController {

    @Autowired
    private ContentService contentService;

    @PostMapping("/vaults")
    public ResponseEntity<VaultResponse> createVault(@RequestBody VaultCreateRequest request) {
        VaultResponse newVault = contentService.createVault(request);
        return new ResponseEntity<>(newVault, HttpStatus.CREATED);
    }

    @PostMapping("/quests")
    public ResponseEntity<QuestResponse> createQuest(@RequestBody QuestCreateRequest request) {
        QuestResponse newQuest = contentService.createQuest(request);
        return new ResponseEntity<>(newQuest, HttpStatus.CREATED);
    }

    @GetMapping("/vaults")
    public ResponseEntity<List<VaultResponse>> getAllVaults() {
        return ResponseEntity.ok(contentService.getAllVaults());
    }

    @GetMapping("/vaults/{id}")
    public ResponseEntity<VaultResponse> getVaultById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(contentService.getVaultById(id));
    }
}