package ro.techvault.content_service.factory;

import org.springframework.stereotype.Component;
import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.enums.GradingStrategyType;
import ro.techvault.content_service.models.CodeChallenge;
import ro.techvault.content_service.models.Quest;
import ro.techvault.content_service.models.Quiz;

import java.util.Map;

@Component
public class QuestFactory {

    public Quest createQuest(QuestCreateRequest request) {
        String type = request.type();
        Map<String, Object> props = request.properties();

        Quest quest;

        switch (type.toUpperCase()) {
            case "CODE_CHALLENGE":
                CodeChallenge challenge = new CodeChallenge();
                challenge.setDescription((String) props.get("description"));
                challenge.setLanguage((String) props.get("language"));
                challenge.setStarterCode((String) props.get("starterCode"));
                challenge.setHints((String) props.get("hints"));

                String strategyType = (String) props.get("gradingStrategy");
                if (strategyType != null) {
                    challenge.setGradingStrategy(GradingStrategyType.valueOf(strategyType.toUpperCase()));
                }
                quest = challenge;
                break;
            case "QUIZ":
                Quiz quiz = new Quiz();
                quest = quiz;
                break;
            default:
                throw new IllegalArgumentException("Unknown quest type: " + type);
        }


        quest.setTitle(request.title());
        quest.setOrder(request.order());
        quest.setXpValue(request.xpValue());

        return quest;
    }
}