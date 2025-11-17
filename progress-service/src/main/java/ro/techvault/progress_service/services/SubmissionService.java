package ro.techvault.progress_service.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.enums.SubmissionStatus;

import java.util.List;
import java.util.UUID;

public interface SubmissionService {
    SubmissionResponse createSubmission(SubmissionRequest request, UUID learnerId);
    Page<SubmissionResponse> getSubmissions(UUID learnerId, UUID questId, SubmissionStatus status, Pageable pageable);
    SubmissionResponse getSubmission(UUID learnerId, UUID submissionId);
    List<SubmissionResponse> getRecentSubmissions(UUID learnerId, int limit);
}
