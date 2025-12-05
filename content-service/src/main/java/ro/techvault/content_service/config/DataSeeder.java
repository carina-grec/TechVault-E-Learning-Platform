package ro.techvault.content_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import ro.techvault.content_service.enums.ContentStatus;
import ro.techvault.content_service.enums.GradingStrategyType;
import ro.techvault.content_service.enums.QuestType;
import ro.techvault.content_service.models.CodeChallenge;
import ro.techvault.content_service.models.TestCase;
import ro.techvault.content_service.models.Vault;
import ro.techvault.content_service.repositories.QuestRepository;
import ro.techvault.content_service.repositories.VaultRepository;

import java.util.List;
import java.util.UUID;

@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final UUID SEEDED_VAULT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID SEEDED_QUEST_ID = UUID.fromString("00000000-0000-0000-0000-000000000101");

    private final VaultRepository vaultRepository;
    private final QuestRepository questRepository;

    public DataSeeder(VaultRepository vaultRepository, QuestRepository questRepository) {
        this.vaultRepository = vaultRepository;
        this.questRepository = questRepository;
    }

    @Override
    public void run(String... args) {
        if (vaultRepository.count() > 0) {
            return;
        }

        log.info("Seeding default vaults and quests...");

        Vault vault = new Vault();
        vault.setId(SEEDED_VAULT_ID);
        vault.setTitle("Pixel Forest Pathways");
        vault.setDescription("Guide sprites through the glade with loops and functions.");
        vault.setTheme("Forest");
        vault.setSlug("pixel-forest-pathways");
        vault.setCategory("Pixel Forest");
        vault.setDifficulty("Beginner");
        vault.setHeroHighlight("Light the glade with successful loops.");
        vault.setMascotName("Pixel the Coding Fox");
        vault.setFeatured(true);
        vault.setStatus(ContentStatus.PUBLISHED);
        vault.setDisplayOrder(1);
        vaultRepository.save(vault);

        CodeChallenge challenge = new CodeChallenge();
        challenge.setId(SEEDED_QUEST_ID);
        challenge.setVault(vault);
        challenge.setTitle("Light Orb Sorters");
        challenge.setOrder(1);
        challenge.setXpValue(50);
        challenge.setStatus(ContentStatus.PUBLISHED);
        challenge.setQuestType(QuestType.CODE_CHALLENGE);
        challenge.setDifficulty("Beginner");
        challenge.setWorldTheme("Forest");
        challenge.setEstimatedTime("25m");
        challenge.setDescription("Sort sparkling light orbs in ascending order.");
        challenge.setLanguage("JAVASCRIPT");
        challenge.setStarterCode("function sortOrbs(orbs) {\n  return [...orbs].sort();\n}");
        challenge.setHints("Remember to avoid mutating the original array.");
        challenge.setGradingStrategy(GradingStrategyType.UNIT_TEST);

        TestCase visible = new TestCase();
        visible.setDescription("Sorts three numbers");
        visible.setInput("[3,1,2]");
        visible.setExpectedOutput("[1,2,3]");
        visible.setHidden(false);
        visible.setCodeChallenge(challenge);

        TestCase hidden = new TestCase();
        hidden.setDescription("Handles duplicates");
        hidden.setInput("[5,5,2,1]");
        hidden.setExpectedOutput("[1,2,5,5]");
        hidden.setHidden(true);
        hidden.setCodeChallenge(challenge);

        challenge.setTestCases(List.of(visible, hidden));
        questRepository.save(challenge);

        log.info("Seeded {} vault(s) and {} quest(s).", vaultRepository.count(), questRepository.count());
    }
}
