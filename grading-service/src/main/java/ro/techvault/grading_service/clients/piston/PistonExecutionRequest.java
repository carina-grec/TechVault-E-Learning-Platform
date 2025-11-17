package ro.techvault.grading_service.clients.piston;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Collections;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PistonExecutionRequest(
        String language,
        String version,
        List<FileEntry> files,
        String stdin,
        List<String> args,
        Integer compile_timeout,
        Integer run_timeout,
        Integer compile_memory_limit,
        Integer run_memory_limit
) {

    public PistonExecutionRequest(String language,
                                  String version,
                                  List<FileEntry> files,
                                  String stdin,
                                  Integer compileTimeout,
                                  Integer runTimeout,
                                  Integer compileMemoryLimit,
                                  Integer runMemoryLimit) {
        this(language,
                version,
                files,
                stdin,
                Collections.emptyList(),
                compileTimeout,
                runTimeout,
                compileMemoryLimit,
                runMemoryLimit);
    }

    public record FileEntry(String name, String content) {}
}
