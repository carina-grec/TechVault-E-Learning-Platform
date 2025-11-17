package ro.techvault.grading_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@ConfigurationProperties(prefix = "piston")
public class PistonProperties {

    /**
     * Base URL for the execute endpoint. Example: http://piston-service:2000/api/v2/execute
     */
    private String baseUrl = "http://localhost:2000/api/v2/execute";

    private int runTimeout = 5_000;
    private int compileTimeout = 10_000;
    private int runMemoryLimit = -1;
    private int compileMemoryLimit = -1;

    /**
     * Map of language -> version understood by Piston.
     */
    private Map<String, String> languageMap = new HashMap<>();

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public int getRunTimeout() {
        return runTimeout;
    }

    public void setRunTimeout(int runTimeout) {
        this.runTimeout = runTimeout;
    }

    public int getCompileTimeout() {
        return compileTimeout;
    }

    public void setCompileTimeout(int compileTimeout) {
        this.compileTimeout = compileTimeout;
    }

    public int getRunMemoryLimit() {
        return runMemoryLimit;
    }

    public void setRunMemoryLimit(int runMemoryLimit) {
        this.runMemoryLimit = runMemoryLimit;
    }

    public int getCompileMemoryLimit() {
        return compileMemoryLimit;
    }

    public void setCompileMemoryLimit(int compileMemoryLimit) {
        this.compileMemoryLimit = compileMemoryLimit;
    }

    public Map<String, String> getLanguageMap() {
        return languageMap;
    }

    public void setLanguageMap(Map<String, String> languageMap) {
        this.languageMap = languageMap;
    }

    public String resolveVersion(String language) {
        if (language == null) {
            return "latest";
            }
        return languageMap.getOrDefault(language.toLowerCase(Locale.ROOT), "latest");
    }
}
