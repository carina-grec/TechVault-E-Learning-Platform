package ro.techvault.progress_service.services;

import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;

import java.util.UUID;

public interface SubmissionService {
    SubmissionResponse createSubmission(SubmissionRequest request, UUID learnerId);
}