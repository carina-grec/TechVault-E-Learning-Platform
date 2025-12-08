package ro.techvault.user_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.enums.UserRole;
import ro.techvault.user_service.models.Admin;
import ro.techvault.user_service.models.Guardian;
import ro.techvault.user_service.models.Learner;
import ro.techvault.user_service.models.User;
import ro.techvault.user_service.repositories.GuardianRepository;
import ro.techvault.user_service.repositories.LearnerRepository;
import ro.techvault.user_service.repositories.UserRepository;

import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String LEARNER_EMAIL = "maya@techvaultkids.io";
    private static final String GUARDIAN_EMAIL = "mentor@techvaultkids.io";
    private static final String ADMIN_EMAIL = "admin@techvaultkids.io";
    private static final UUID LEARNER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID GUARDIAN_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID ADMIN_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    private final UserRepository userRepository;
    private final LearnerRepository learnerRepository;
    private final GuardianRepository guardianRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
            LearnerRepository learnerRepository,
            GuardianRepository guardianRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.learnerRepository = learnerRepository;
        this.guardianRepository = guardianRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Ensuring default TechVault demo users...");

        Learner learner = ensureLearner();
        Guardian guardian = ensureGuardian();
        ensureAdmin();
        linkGuardianAndLearner(guardian, learner);
    }

    private Learner ensureLearner() {
        Optional<User> existing = userRepository.findByEmail(LEARNER_EMAIL);
        if (existing.isPresent() && existing.get() instanceof Learner learner) {
            return learner;
        }

        Learner learner = new Learner();
        learner.setId(LEARNER_ID);
        learner.setEmail(LEARNER_EMAIL);
        learner.setPasswordHash(passwordEncoder.encode("learn123"));
        learner.setRole(UserRole.LEARNER);
        learner.setStatus(AccountStatus.ACTIVE);
        learner.setDisplayName("Maya Sparks");
        learner.setAvatarUrl("https://cdn.techvault/mock/maya.png");
        learner.setUsername("maya-sparks");
        learner.setAge(12);
        learner.setXp(250);
        learner.setLevel(3);
        learner.setCurrentStreak(5);
        learner.setGuardians(new HashSet<>());
        return learnerRepository.save(learner);
    }

    private Guardian ensureGuardian() {
        Optional<User> existing = userRepository.findByEmail(GUARDIAN_EMAIL);
        if (existing.isPresent() && existing.get() instanceof Guardian guardian) {
            if (guardian.getMonitoredLearners() == null) {
                guardian.setMonitoredLearners(new HashSet<>());
            }
            return guardian;
        }

        Guardian guardian = new Guardian();
        guardian.setId(GUARDIAN_ID);
        guardian.setEmail(GUARDIAN_EMAIL);
        guardian.setPasswordHash(passwordEncoder.encode("guardian123"));
        guardian.setRole(UserRole.GUARDIAN);
        guardian.setStatus(AccountStatus.ACTIVE);
        guardian.setDisplayName("Mentor Ivy");
        guardian.setMonitoredLearners(new HashSet<>());
        return guardianRepository.save(guardian);
    }

    private void ensureAdmin() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return;
        }
        Admin admin = new Admin();
        admin.setId(ADMIN_ID);
        admin.setEmail(ADMIN_EMAIL);
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setStatus(AccountStatus.ACTIVE);
        admin.setDisplayName("Coach Nolan");
        userRepository.save(admin);
    }

    private void linkGuardianAndLearner(Guardian guardian, Learner learner) {
        if (guardian.getMonitoredLearners() == null) {
            guardian.setMonitoredLearners(new HashSet<>());
        }
        if (!guardian.getMonitoredLearners().contains(learner)) {
            guardian.getMonitoredLearners().add(learner);
            guardianRepository.save(guardian);
        }

        if (learner.getGuardians() == null) {
            learner.setGuardians(new HashSet<>());
        }
        if (!learner.getGuardians().contains(guardian)) {
            learner.getGuardians().add(guardian);
            learnerRepository.save(learner);
        }
    }
}
