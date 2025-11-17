package ro.techvault.progress_service.dtos;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

public record SubmissionGradingJob(
        UUID submissionId,
        UUID questId,
        String submittedCode,
        String language,
        List<TestCasePayload> testCases
) implements Serializable {}
