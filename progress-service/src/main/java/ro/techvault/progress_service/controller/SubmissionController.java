package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.services.SubmissionService;

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

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}