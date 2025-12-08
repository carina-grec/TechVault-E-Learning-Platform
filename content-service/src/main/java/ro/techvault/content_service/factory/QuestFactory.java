package ro.techvault.content_service.factory;

import org.springframework.stereotype.Component;
import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.enums.QuestType;
import ro.techvault.content_service.models.CodeChallenge;
import ro.techvault.content_service.models.Quest;
import ro.techvault.content_service.models.Quiz;

@Component
public class QuestFactory {

    public Quest createQuest(QuestCreateRequest request) {
        QuestType questType = resolveQuestType(request.type());
        Quest quest = switch (questType) {
            case CODE_CHALLENGE -> buildCodeChallenge(request);
            case QUIZ -> new Quiz();
            case LESSON -> buildLesson(request);
        };

        quest.setTitle(request.title());
        quest.setOrder(request.order());
        quest.setXpValue(request.xpValue());
        quest.setQuestType(questType);
        quest.setDifficulty(request.difficulty());
        quest.setWorldTheme(request.worldTheme());
        quest.setEstimatedTime(request.estimatedTime());

        return quest;
    }

    private QuestType resolveQuestType(String type) {
        if (type == null || type.isBlank()) {
            return QuestType.CODE_CHALLENGE;
        }
        try {
            return QuestType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported quest type: " + type);
        }
    }

    private CodeChallenge buildCodeChallenge(QuestCreateRequest request) {
        CodeChallenge challenge = new CodeChallenge();
        challenge.setDescription(request.description());
        challenge.setLanguage(request.language());
        challenge.setStarterCode(request.starterCode());
        challenge.setHints(request.hints());
        if (request.gradingStrategy() != null) {
            challenge.setGradingStrategy(request.gradingStrategy());
        }
        return challenge;
    }

    private ro.techvault.content_service.models.Lesson buildLesson(QuestCreateRequest request) {
        ro.techvault.content_service.models.Lesson lesson = new ro.techvault.content_service.models.Lesson();
        lesson.setContent(request.content());
        lesson.setVideoUrl(request.videoUrl());
        return lesson;
    }
}
