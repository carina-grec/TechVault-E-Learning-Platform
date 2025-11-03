package ro.techvault.progress_service.dtos;

import java.util.UUID;

public record SubmissionRequest(
        UUID questId,
        String submittedCode,
        String language
) {}