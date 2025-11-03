package ro.techvault.progress_service.dtos;

import java.io.Serializable;
import java.util.UUID;

public record SubmissionGradingJob(
        UUID submissionId,
        UUID questId,
        String submittedCode,
        String language
) implements Serializable {}