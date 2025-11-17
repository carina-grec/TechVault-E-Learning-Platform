package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.progress_service.dtos.LearnerProgressSummaryResponse;
import ro.techvault.progress_service.dtos.VaultProgressResponse;
import ro.techvault.progress_service.services.LearnerProgressService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learner/progress")
public class LearnerProgressController {

    @Autowired
    private LearnerProgressService learnerProgressService;

    @GetMapping("/summary")
    public ResponseEntity<LearnerProgressSummaryResponse> getSummary(
            @RequestHeader("X-User-Id") UUID learnerId
    ) {
        return ResponseEntity.ok(learnerProgressService.getSummary(learnerId));
    }

    @GetMapping("/vaults")
    public ResponseEntity<List<VaultProgressResponse>> getVaults(
            @RequestHeader("X-User-Id") UUID learnerId
    ) {
        return ResponseEntity.ok(learnerProgressService.getVaultProgress(learnerId));
    }

    @GetMapping("/vaults/{vaultId}")
    public ResponseEntity<VaultProgressResponse> getVaultProgress(
            @RequestHeader("X-User-Id") UUID learnerId,
            @PathVariable UUID vaultId
    ) {
        return ResponseEntity.ok(learnerProgressService.getVaultProgress(learnerId, vaultId));
    }
}
