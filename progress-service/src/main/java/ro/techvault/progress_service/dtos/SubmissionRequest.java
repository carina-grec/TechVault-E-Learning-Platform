package ro.techvault.progress_service.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record SubmissionRequest(
        UUID questId,
        @JsonProperty("source") String submittedCode,
        String language
) {}
