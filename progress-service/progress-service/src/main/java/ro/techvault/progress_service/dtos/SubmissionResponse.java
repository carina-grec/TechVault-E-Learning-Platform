package ro.techvault.progress_service.dtos;

import ro.techvault.progress_service.enums.SubmissionStatus;

import java.sql.Timestamp;
import java.util.UUID;

public record SubmissionResponse(
        UUID submissionId,
        UUID questId,
        SubmissionStatus status,
        Timestamp timestamp
) {}