package ro.techvault.content_service.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ro.techvault.content_service.dtos.QuestCreateRequest;
import ro.techvault.content_service.dtos.QuestResponse;
import ro.techvault.content_service.dtos.TestCaseDto;
import ro.techvault.content_service.dtos.VaultCreateRequest;
import ro.techvault.content_service.dtos.VaultDetailResponse;
import ro.techvault.content_service.dtos.VaultResponse;
import ro.techvault.content_service.enums.ContentStatus;
import ro.techvault.content_service.factory.QuestFactory;
import ro.techvault.content_service.models.CodeChallenge;
import ro.techvault.content_service.models.Quest;
import ro.techvault.content_service.models.TestCase;
import ro.techvault.content_service.models.Vault;
import ro.techvault.content_service.repositories.QuestRepository;
import ro.techvault.content_service.repositories.VaultRepository;
import ro.techvault.content_service.services.ContentService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentServiceImpl implements ContentService {

    @Autowired
    private VaultRepository vaultRepository;

    @Autowired
    private QuestRepository questRepository;

    @Autowired
    private QuestFactory questFactory;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Override
    public VaultResponse createVault(VaultCreateRequest request) {
        Vault vault = applyVaultFields(new Vault(), request);
        vault.setStatus(request.status() == null ? ContentStatus.DRAFT : request.status());
        Vault savedVault = vaultRepository.save(vault);
        return mapVault(savedVault);
    }

    @Override
    public VaultResponse updateVault(Long vaultId, VaultCreateRequest request) {
        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException("Vault not found: " + vaultId));
        applyVaultFields(vault, request);
        Vault savedVault = vaultRepository.save(vault);
        return mapVault(savedVault);
    }

    @Override
    public void deleteVault(Long vaultId) {
        if (!vaultRepository.existsById(vaultId)) {
            throw new RuntimeException("Vault not found");
        }
        vaultRepository.deleteById(vaultId);
    }

    @Override
    public List<VaultResponse> findVaults(String difficulty, String theme, Boolean featured, String search) {
        return vaultRepository.findAll().stream()
                .filter(vault -> filterVault(vault, difficulty, theme, featured, search))
                .sorted(Comparator.comparingInt(Vault::getDisplayOrder))
                .map(this::mapVault)
                .collect(Collectors.toList());
    }

    @Override
    public VaultDetailResponse getVaultDetail(Long vaultId) {
        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException("Vault not found"));
        List<QuestResponse> quests = questRepository.findByVaultId(vaultId).stream()
                .sorted(Comparator.comparingInt(Quest::getOrder))
                .map(this::mapQuest)
                .toList();
        return new VaultDetailResponse(mapVault(vault), quests);
    }

    @Override
    public QuestResponse createQuest(QuestCreateRequest request) {
        Vault vault = vaultRepository.findById(request.vaultId())
                .orElseThrow(() -> new RuntimeException("Vault not found with id: " + request.vaultId()));
        Quest quest = questFactory.createQuest(request);
        quest.setVault(vault);
        if (quest instanceof CodeChallenge challenge) {
            applyTestCases(challenge, request.testCases());
        } else if (quest instanceof ro.techvault.content_service.models.Quiz quiz) {
            quiz.setTextDescription(request.description());
            applyQuizContent(quiz, request.content());
        }
        Quest savedQuest = questRepository.save(quest);
        return mapQuest(savedQuest);
    }

    @Override
    public QuestResponse updateQuest(UUID questId, QuestCreateRequest request) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found: " + questId));
        quest.setTitle(request.title());
        quest.setOrder(request.order());
        quest.setXpValue(request.xpValue());
        quest.setDifficulty(request.difficulty());
        quest.setWorldTheme(request.worldTheme());
        quest.setEstimatedTime(request.estimatedTime());
        if (quest instanceof CodeChallenge challenge) {
            challenge.setDescription(request.description());
            challenge.setLanguage(request.language());
            challenge.setStarterCode(request.starterCode());
            challenge.setHints(request.hints());
            if (request.gradingStrategy() != null) {
                challenge.setGradingStrategy(request.gradingStrategy());
            }
            if (request.testCases() != null) {
                applyTestCases(challenge, request.testCases());
            }
        } else if (quest instanceof ro.techvault.content_service.models.Lesson lesson) {
            lesson.setContent(request.content());
            lesson.setVideoUrl(request.videoUrl());
        } else if (quest instanceof ro.techvault.content_service.models.Quiz quiz) {
            quiz.setTextDescription(request.description());
            applyQuizContent(quiz, request.content());
        }
        Quest saved = questRepository.save(quest);
        return mapQuest(saved);
    }

    @Override
    public void deleteQuest(UUID questId) {
        if (!questRepository.existsById(questId)) {
            throw new RuntimeException("Quest not found");
        }
        questRepository.deleteById(questId);
    }

    @Override
    public List<QuestResponse> getQuests(Long vaultId, String type, String difficulty) {
        return questRepository.findAll().stream()
                .filter(quest -> vaultId == null || quest.getVault().getId().equals(vaultId))
                .filter(quest -> !StringUtils.hasText(type) || quest.getQuestType().name().equalsIgnoreCase(type))
                .filter(quest -> !StringUtils.hasText(difficulty)
                        || difficulty.equalsIgnoreCase(defaultString(quest.getDifficulty())))
                .sorted(Comparator.comparingInt(Quest::getOrder))
                .map(this::mapQuest)
                .collect(Collectors.toList());
    }

    @Override
    public QuestResponse getQuestById(UUID questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));
        return mapQuest(quest);
    }

    @Override
    public List<TestCaseDto> getTestCases(UUID questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));
        if (quest instanceof CodeChallenge challenge) {
            return mapTestCases(challenge);
        }
        return List.of();
    }

    private Vault applyVaultFields(Vault vault, VaultCreateRequest request) {
        vault.setTitle(request.title());
        vault.setDescription(request.description());
        vault.setTheme(request.theme());
        vault.setDisplayOrder(request.displayOrder());
        if (StringUtils.hasText(request.slug())) {
            vault.setSlug(request.slug().toLowerCase(Locale.ROOT));
        }
        vault.setCategory(request.category());
        vault.setDifficulty(request.difficulty());
        vault.setHeroHighlight(request.heroHighlight());
        if (request.featured() != null) {
            vault.setFeatured(request.featured());
        }
        if (request.status() != null) {
            vault.setStatus(request.status());
        }
        return vault;
    }

    private boolean filterVault(Vault vault, String difficulty, String theme, Boolean featured, String search) {
        boolean matches = true;
        if (StringUtils.hasText(difficulty)) {
            matches &= difficulty.equalsIgnoreCase(defaultString(vault.getDifficulty()));
        }
        if (StringUtils.hasText(theme)) {
            matches &= theme.equalsIgnoreCase(defaultString(vault.getTheme()));
        }
        if (featured != null) {
            matches &= vault.isFeatured() == featured;
        }
        if (StringUtils.hasText(search)) {
            String text = (vault.getTitle() + " " + defaultString(vault.getDescription())).toLowerCase(Locale.ROOT);
            matches &= text.contains(search.toLowerCase(Locale.ROOT));
        }
        return matches;
    }

    private VaultResponse mapVault(Vault vault) {
        int questCount = vault.getQuests() == null ? 0 : vault.getQuests().size();
        return new VaultResponse(
                vault.getId(),
                vault.getTitle(),
                vault.getDescription(),
                vault.getTheme(),
                vault.getSlug(),
                vault.getCategory(),
                vault.getDifficulty(),
                vault.getHeroHighlight(),
                vault.isFeatured(),
                vault.getStatus(),
                vault.getDisplayOrder(),
                questCount);
    }

    private QuestResponse mapQuest(Quest quest) {
        QuestResponse.QuestResponseBuilder builder = QuestResponse.builder()
                .id(quest.getId())
                .vaultId(quest.getVault().getId())
                .title(quest.getTitle())
                .questType(
                        quest.getQuestType() == null ? quest.getClass().getSimpleName() : quest.getQuestType().name())
                .order(quest.getOrder())
                .xpValue(quest.getXpValue())
                .status(quest.getStatus())
                .difficulty(quest.getDifficulty())
                .worldTheme(quest.getWorldTheme())
                .estimatedTime(quest.getEstimatedTime());

        if (quest instanceof CodeChallenge challenge) {
            builder.description(challenge.getDescription())
                    .language(challenge.getLanguage())
                    .starterCode(challenge.getStarterCode())
                    .hints(challenge.getHints())
                    .gradingStrategy(challenge.getGradingStrategy())
                    .testCases(mapTestCases(challenge));
        } else if (quest instanceof ro.techvault.content_service.models.Lesson lesson) {
            builder.content(lesson.getContent())
                    .videoUrl(lesson.getVideoUrl());
        } else if (quest instanceof ro.techvault.content_service.models.Quiz quiz) {
            builder.description(quiz.getTextDescription());
            builder.content(serializeQuizContent(quiz));
        }
        return builder.build();
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private void applyTestCases(CodeChallenge challenge, List<TestCaseDto> testCases) {
        List<TestCase> entities = new ArrayList<>();
        List<TestCaseDto> safeCases = testCases == null ? List.of() : testCases;
        for (int i = 0; i < safeCases.size(); i++) {
            TestCaseDto dto = safeCases.get(i);
            TestCase entity = new TestCase();
            entity.setId(dto.id());
            entity.setDescription(dto.description() != null ? dto.description() : "Case " + (i + 1));
            entity.setInput(dto.input());
            entity.setExpectedOutput(dto.expectedOutput());
            entity.setHidden(dto.hidden());
            entity.setCodeChallenge(challenge);
            entities.add(entity);
        }

        if (challenge.getTestCases() == null) {
            challenge.setTestCases(new ArrayList<>(entities));
        } else {
            challenge.getTestCases().clear();
            challenge.getTestCases().addAll(entities);
        }
    }

    private List<TestCaseDto> mapTestCases(CodeChallenge challenge) {
        if (challenge.getTestCases() == null || challenge.getTestCases().isEmpty()) {
            return List.of();
        }
        List<TestCaseDto> mapped = new ArrayList<>();
        int index = 1;
        for (TestCase testCase : challenge.getTestCases()) {
            mapped.add(new TestCaseDto(
                    testCase.getId(),
                    testCase.getDescription() != null ? testCase.getDescription() : "Case " + index,
                    testCase.getInput(),
                    testCase.getExpectedOutput(),
                    testCase.isHidden()));
            index++;
        }
        return mapped;
    }

    private void applyQuizContent(ro.techvault.content_service.models.Quiz quiz, String contentJson) {
        if (!StringUtils.hasText(contentJson))
            return;
        try {
            // Expected Format: [{ "text": "...", "options": ["..."], "correctAnswer": "0"
            // }]
            List<java.util.Map<String, Object>> questionsData = objectMapper.readValue(contentJson,
                    new com.fasterxml.jackson.core.type.TypeReference<>() {
                    });

            List<ro.techvault.content_service.models.QuizQuestion> questions = new ArrayList<>();
            for (java.util.Map<String, Object> qData : questionsData) {
                ro.techvault.content_service.models.QuizQuestion bq = new ro.techvault.content_service.models.QuizQuestion();
                bq.setText((String) qData.get("text"));
                bq.setQuiz(quiz);

                List<String> opts = (List<String>) qData.get("options");
                String correctIdxStr = String.valueOf(qData.get("correctAnswer"));
                int correctIdx = Integer.parseInt(correctIdxStr);

                List<ro.techvault.content_service.models.QuizAnswer> answers = new ArrayList<>();
                for (int i = 0; i < opts.size(); i++) {
                    ro.techvault.content_service.models.QuizAnswer ba = new ro.techvault.content_service.models.QuizAnswer();
                    ba.setText(opts.get(i));
                    ba.setCorrect(i == correctIdx);
                    ba.setQuestion(bq);
                    answers.add(ba);
                }
                bq.setAnswers(answers);
                questions.add(bq);
            }

            if (quiz.getQuestions() == null) {
                quiz.setQuestions(questions);
            } else {
                quiz.getQuestions().clear();
                quiz.getQuestions().addAll(questions);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse quiz content: " + e.getMessage(), e);
        }
    }

    private String serializeQuizContent(ro.techvault.content_service.models.Quiz quiz) {
        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty())
            return "[]";
        try {
            List<java.util.Map<String, Object>> list = new ArrayList<>();
            for (ro.techvault.content_service.models.QuizQuestion q : quiz.getQuestions()) {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("text", q.getText());

                List<String> options = new ArrayList<>();
                int correctIdx = 0;
                if (q.getAnswers() != null) {
                    for (int i = 0; i < q.getAnswers().size(); i++) {
                        ro.techvault.content_service.models.QuizAnswer a = q.getAnswers().get(i);
                        options.add(a.getText());
                        if (a.isCorrect())
                            correctIdx = i;
                    }
                }
                map.put("options", options);
                map.put("correctAnswer", String.valueOf(correctIdx));
                list.add(map);
            }
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }
}
