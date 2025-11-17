package ro.techvault.grading_service.clients.piston;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PistonExecutionResponse(
        String language,
        String version,
        RunResult run,
        RunResult compile
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RunResult(
            String stdout,
            String stderr,
            Integer code,
            String output,
            String signal
    ) {}
}
