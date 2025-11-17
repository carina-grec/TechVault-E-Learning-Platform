package ro.techvault.grading_service.dtos;

import java.io.Serializable;

public record TestCasePayload(
        String description,
        String input,
        String expectedOutput
) implements Serializable {}
