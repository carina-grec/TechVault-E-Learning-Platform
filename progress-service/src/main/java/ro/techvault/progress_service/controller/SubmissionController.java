package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.services.SubmissionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResponse> submitQuest(
            @RequestBody SubmissionRequest request,
            @RequestHeader("X-User-Id") UUID learnerId
    ) {
        SubmissionResponse response = submissionService.createSubmission(request, learnerId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<SubmissionResponse>> listSubmissions(
            @RequestHeader("X-User-Id") UUID learnerId,
            @RequestParam(required = false) UUID questId,
            @RequestParam(required = false) SubmissionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<SubmissionResponse> submissions = submissionService.getSubmissions(learnerId, questId, status, PageRequest.of(page, size));
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResponse> getSubmission(
            @RequestHeader("X-User-Id") UUID learnerId,
            @PathVariable UUID submissionId
    ) {
        return ResponseEntity.ok(submissionService.getSubmission(learnerId, submissionId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SubmissionResponse>> recentSubmissions(
            @RequestHeader("X-User-Id") UUID learnerId,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(submissionService.getRecentSubmissions(learnerId, limit));
    }
}
