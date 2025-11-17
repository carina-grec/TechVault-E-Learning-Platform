package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ro.techvault.progress_service.dtos.LearnerProgressSummaryResponse;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.services.LearnerProgressService;
import ro.techvault.progress_service.services.SubmissionService;

import java.util.UUID;

@RestController
@RequestMapping("/api/guardian/learners")
public class GuardianProgressController {

    @Autowired
    private LearnerProgressService learnerProgressService;

    @Autowired
    private SubmissionService submissionService;

    @GetMapping("/{learnerId}/progress")
    public ResponseEntity<LearnerProgressSummaryResponse> learnerProgress(
            @RequestHeader("X-User-Role") String roleHeader,
            @PathVariable UUID learnerId
    ) {
        ensureGuardian(roleHeader);
        return ResponseEntity.ok(learnerProgressService.getSummary(learnerId));
    }

    @GetMapping("/{learnerId}/submissions")
    public ResponseEntity<Page<SubmissionResponse>> learnerSubmissions(
            @RequestHeader("X-User-Role") String roleHeader,
            @PathVariable UUID learnerId,
            @RequestParam(required = false) UUID questId,
            @RequestParam(required = false) SubmissionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ensureGuardian(roleHeader);
        return ResponseEntity.ok(submissionService.getSubmissions(learnerId, questId, status, PageRequest.of(page, size)));
    }

    private void ensureGuardian(String roleHeader) {
        if (!"GUARDIAN".equalsIgnoreCase(roleHeader)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Guardian role required");
        }
    }
}
