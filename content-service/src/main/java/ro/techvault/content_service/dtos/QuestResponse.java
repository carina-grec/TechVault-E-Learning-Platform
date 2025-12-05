package ro.techvault.content_service.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.content_service.enums.ContentStatus;
import ro.techvault.content_service.enums.GradingStrategyType;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuestResponse {


    private UUID id;
    private UUID vaultId;
    private String title;
    private String questType;
    private int order;
    private int xpValue;
    private ContentStatus status;

    private String description;
    private String language;
    private String starterCode;
    private String difficulty;
    private String worldTheme;
    private String estimatedTime;
    private String hints;
    private GradingStrategyType gradingStrategy;
    private List<TestCaseDto> testCases;

}
