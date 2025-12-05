package ro.techvault.content_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.content_service.dtos.TestCaseDto;
import ro.techvault.content_service.services.ContentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/internal/quests")
public class InternalQuestController {

    @Autowired
    private ContentService contentService;

    @GetMapping("/{questId}/test-cases")
    public ResponseEntity<List<TestCaseDto>> getTestCases(@PathVariable UUID questId) {
        return ResponseEntity.ok(contentService.getTestCases(questId));
    }
}
