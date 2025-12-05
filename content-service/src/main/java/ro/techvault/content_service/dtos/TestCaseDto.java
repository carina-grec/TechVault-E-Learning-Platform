package ro.techvault.content_service.dtos;

import java.util.UUID;

public record TestCaseDto(
        UUID id,
        String description,
        String input,
        String expectedOutput,
        boolean hidden
) {}
