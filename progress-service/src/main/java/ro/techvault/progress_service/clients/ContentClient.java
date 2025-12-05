package ro.techvault.progress_service.clients;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ro.techvault.progress_service.dtos.TestCasePayload;

import java.util.List;
import java.util.UUID;

@Component
public class ContentClient {

    private static final Logger log = LoggerFactory.getLogger(ContentClient.class);

    private final RestTemplate restTemplate;

    @Value("${content.service.url:http://content-service:8083}")
    private String contentServiceUrl;

    public ContentClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<TestCasePayload> fetchTestCases(UUID questId) {
        String url = String.format("%s/api/internal/quests/%s/test-cases", contentServiceUrl, questId);
        try {
            ResponseEntity<List<TestCasePayload>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            return response.getBody() == null ? List.of() : response.getBody();
        } catch (Exception ex) {
            log.warn("Failed to fetch test cases for quest {}: {}", questId, ex.getMessage());
            return List.of();
        }
    }
}
