package ro.techvault.grading_service.clients.piston;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import ro.techvault.grading_service.config.PistonProperties;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Component
public class PistonClient {

    private static final Logger log = LoggerFactory.getLogger(PistonClient.class);

    private final RestTemplate restTemplate;
    private final PistonProperties properties;
    private final ObjectMapper objectMapper;

    public PistonClient(RestTemplate restTemplate, PistonProperties properties, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public PistonExecutionResponse execute(String language, String sourceCode, String stdin) {
        String resolvedLanguage = normalizeLanguage(language);
        String version = properties.resolveVersion(resolvedLanguage);
        String filename = determineFilename(resolvedLanguage);

        PistonExecutionRequest request = new PistonExecutionRequest(
                resolvedLanguage,
                version,
                List.of(new PistonExecutionRequest.FileEntry(filename, sourceCode)),
                stdin == null ? "" : stdin,
                properties.getCompileTimeout(),
                properties.getRunTimeout(),
                properties.getCompileMemoryLimit(),
                properties.getRunMemoryLimit()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<PistonExecutionRequest> entity = new HttpEntity<>(request, headers);

        String url = UriComponentsBuilder.fromHttpUrl(properties.getBaseUrl()).toUriString();
        log.debug("Sending request to Piston at {}", url);

        return restTemplate.postForObject(url, entity, PistonExecutionResponse.class);
    }

    public String serializeResponse(PistonExecutionResponse response) {
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            log.warn("Unable to serialize Piston response", e);
            return "{}";
        }
    }

    private String determineFilename(String language) {
        String normalized = language == null ? "" : language.toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "python", "py" -> "Main.py";
            case "javascript", "node", "nodejs" -> "main.js";
            case "java" -> "Main.java";
            case "go" -> "main.go";
            case "cpp", "c++" -> "main.cpp";
            case "c" -> "main.c";
            default -> "main.txt";
        };
    }

    private static final Map<String, String> LANGUAGE_ALIASES = Map.ofEntries(
            Map.entry("py", "python"),
            Map.entry("py3", "python"),
            Map.entry("python3", "python"),
            Map.entry("python2", "python"),
            Map.entry("javascript", "javascript"),
            Map.entry("js", "javascript"),
            Map.entry("nodejs", "javascript"),
            Map.entry("node", "javascript")
    );

    private String normalizeLanguage(String language) {
        if (language == null || language.isBlank()) {
            return "python";
        }
        String cleaned = language.trim().toLowerCase(Locale.ROOT);
        cleaned = cleaned.replace('_', '-');
        cleaned = cleaned.replace(" ", "-");
        // strip version or alias suffixes like python-3.10.0 or python:3.10
        for (char delimiter : new char[]{'-', ':', '@'}) {
            int idx = cleaned.indexOf(delimiter);
            if (idx > 0) {
                cleaned = cleaned.substring(0, idx);
                break;
            }
        }
        cleaned = cleaned.trim();
        if (cleaned.isEmpty()) {
            return "python";
        }
        return LANGUAGE_ALIASES.getOrDefault(cleaned, cleaned);
    }
}
