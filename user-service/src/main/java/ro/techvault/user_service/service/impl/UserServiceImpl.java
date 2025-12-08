package ro.techvault.user_service.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.techvault.user_service.dtos.AdminUserUpdateRequest;
import ro.techvault.user_service.dtos.ChangePasswordRequest;
import ro.techvault.user_service.dtos.CreateUserRequestDTO;
import ro.techvault.user_service.dtos.GuardianLearnerResponse;
import ro.techvault.user_service.dtos.GuardianLinkRequest;
import ro.techvault.user_service.dtos.InternalUserResponse;
import ro.techvault.user_service.dtos.UpdateProfileRequest;
import ro.techvault.user_service.dtos.UserProfileResponse;
import ro.techvault.user_service.dtos.UserResponseDTO;
import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.enums.UserRole;
import ro.techvault.user_service.models.Admin;
import ro.techvault.user_service.models.Guardian;
import ro.techvault.user_service.models.Learner;
import ro.techvault.user_service.models.User;
import ro.techvault.user_service.repositories.GuardianRepository;
import ro.techvault.user_service.repositories.LearnerRepository;
import ro.techvault.user_service.repositories.UserRepository;
import ro.techvault.user_service.service.UserService;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private GuardianRepository guardianRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User newUser = buildUserByRole(request);
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(request.getPasswordHash());
        newUser.setRole(request.getRole());
        newUser.setDisplayName(resolveDisplayName(request));

        User savedUser = userRepository.save(newUser);
        return mapToResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public InternalUserResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return new InternalUserResponse(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole(),
                user.getDisplayName(),
                user.getStatus());
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer xp = null;
        Integer level = null;
        Integer streak = null;
        List<UUID> linkedLearners = new ArrayList<>();
        List<UUID> linkedGuardians = new ArrayList<>();

        if (user instanceof Learner learner) {
            xp = learner.getXp();
            level = learner.getLevel();
            streak = learner.getCurrentStreak();
            if (learner.getGuardians() != null) {
                linkedGuardians = learner.getGuardians().stream()
                        .map(User::getId)
                        .toList();
            }
        }

        if (user instanceof Guardian guardian && guardian.getMonitoredLearners() != null) {
            linkedLearners = guardian.getMonitoredLearners().stream()
                    .map(User::getId)
                    .toList();
        }

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getDisplayName(),
                xp,
                level,
                streak,
                user.getAvatarUrl(),
                user.getAvatarUrl(),
                readSettings(user),
                linkedLearners,
                linkedGuardians,
                toInstant(user.getCreatedAt()),
                user.getStatus());
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (hasText(request.displayName())) {
            user.setDisplayName(request.displayName());
        }
        if (hasText(request.avatarUrl())) {
            user.setAvatarUrl(request.avatarUrl());
        }
        if (request.settings() != null) {
            user.setSettingsJson(writeSettings(request.settings()));
        }

        User saved = userRepository.save(user);
        return getCurrentUserProfile(saved.getId());
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid current password");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> getUsers(Pageable pageable, UserRole roleFilter) {
        Page<User> page = roleFilter == null
                ? userRepository.findAll(pageable)
                : userRepository.findByRole(roleFilter, pageable);
        List<UserResponseDTO> content = page.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    @Transactional
    public UserResponseDTO adminUpdateUser(UUID userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.status() != null) {
            user.setStatus(request.status());
        }
        if (hasText(request.displayName())) {
            user.setDisplayName(request.displayName());
        }
        if (request.role() != null && request.role() != user.getRole()) {
            user.setRole(request.role());
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuardianLearnerResponse> getGuardianLearners(UUID guardianId) {
        Guardian guardian = guardianRepository.findById(guardianId)
                .orElseThrow(() -> new RuntimeException("Guardian not found"));
        if (guardian.getMonitoredLearners() == null) {
            return List.of();
        }
        return guardian.getMonitoredLearners()
                .stream()
                .map(this::toGuardianLearnerResponse)
                .toList();
    }

    @Override
    @Transactional
    public GuardianLearnerResponse linkGuardianToLearner(UUID guardianId, GuardianLinkRequest request) {
        Guardian guardian = guardianRepository.findById(guardianId)
                .orElseThrow(() -> new RuntimeException("Guardian not found"));
        Learner learner = findLearnerByIdentifier(request.learnerIdentifier());
        if (guardian.getMonitoredLearners() == null) {
            guardian.setMonitoredLearners(new java.util.HashSet<>());
        }
        guardian.getMonitoredLearners().add(learner);
        guardianRepository.save(guardian);
        return toGuardianLearnerResponse(learner);
    }

    private GuardianLearnerResponse toGuardianLearnerResponse(Learner learner) {
        return new GuardianLearnerResponse(
                learner.getId(),
                learner.getDisplayName(),
                learner.getUsername(),
                learner.getXp(),
                learner.getLevel(),
                learner.getCurrentStreak());
    }

    private Learner findLearnerByIdentifier(String identifier) {
        if (!hasText(identifier)) {
            throw new RuntimeException("Learner identifier is required");
        }
        return learnerRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByEmail(identifier)
                        .filter(Learner.class::isInstance)
                        .map(Learner.class::cast))
                .or(() -> tryFindLearnerById(identifier))
                .orElseThrow(() -> new RuntimeException("Learner not found"));
    }

    private Optional<Learner> tryFindLearnerById(String identifier) {
        try {
            UUID learnerId = UUID.fromString(identifier);
            return learnerRepository.findById(learnerId);
        } catch (IllegalArgumentException ignored) {
            return Optional.empty();
        }
    }

    private User buildUserByRole(CreateUserRequestDTO request) {
        return switch (request.getRole()) {
            case LEARNER -> configureLearner(request);
            case GUARDIAN -> configureGuardian();
            case ADMIN -> configureAdmin();
        };
    }

    private Learner configureLearner(CreateUserRequestDTO request) {
        Learner learner = new Learner();
        String username = resolveLearnerUsername(request);
        if (learnerRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already in use");
        }
        learner.setUsername(username);
        int age = request.getAge() == null ? 0 : request.getAge();
        learner.setAge(age);
        learner.setStatus(age < 13 ? AccountStatus.PENDING_CONSENT : AccountStatus.ACTIVE);
        learner.setXp(0);
        learner.setLevel(1);
        learner.setCurrentStreak(0);
        learner.setGuardians(new java.util.HashSet<>());
        return learner;
    }

    private Guardian configureGuardian() {
        Guardian guardian = new Guardian();
        guardian.setStatus(AccountStatus.ACTIVE);
        guardian.setMonitoredLearners(new java.util.HashSet<>());
        return guardian;
    }

    private Admin configureAdmin() {
        Admin admin = new Admin();
        admin.setStatus(AccountStatus.ACTIVE);
        return admin;
    }

    private String resolveLearnerUsername(CreateUserRequestDTO request) {
        String candidate = null;
        if (hasText(request.getUsername())) {
            candidate = request.getUsername();
        } else if (hasText(request.getDisplayName())) {
            candidate = request.getDisplayName();
        } else if (hasText(request.getEmail())) {
            String email = request.getEmail().trim();
            int atIndex = email.indexOf('@');
            candidate = atIndex > 0 ? email.substring(0, atIndex) : email;
        }

        if (!hasText(candidate)) {
            candidate = "learner-" + UUID.randomUUID().toString().substring(0, 8);
        }

        String normalized = candidate.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (!hasText(normalized)) {
            normalized = "learner-" + UUID.randomUUID().toString().substring(0, 8);
        }
        return normalized;
    }

    private String resolveDisplayName(CreateUserRequestDTO request) {
        if (hasText(request.getDisplayName())) {
            return request.getDisplayName();
        }
        if (hasText(request.getUsername())) {
            return request.getUsername();
        }
        return request.getEmail();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private UserResponseDTO mapToResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getDisplayName(),
                user.getStatus(),
                user.getCreatedAt());
    }

    private Map<String, Object> readSettings(User user) {
        if (user.getSettingsJson() == null || user.getSettingsJson().isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(user.getSettingsJson(), new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Unable to parse user settings", e);
        }
    }

    private String writeSettings(Map<String, Object> settings) {
        try {
            return objectMapper.writeValueAsString(settings);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Unable to persist user settings", e);
        }
    }

    private Instant toInstant(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toInstant();
    }

    @Override
    @Transactional
    public void initiateConsent(UUID userId, String parentEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!(user instanceof Learner learner)) {
            throw new RuntimeException("User is not a learner");
        }

        Guardian guardian;
        Optional<User> existingUser = userRepository.findByEmail(parentEmail);
        if (existingUser.isPresent()) {
            if (existingUser.get() instanceof Guardian g) {
                guardian = g;
            } else {
                throw new RuntimeException("Email belongs to a non-guardian user");
            }
        } else {
            guardian = new Guardian();
            guardian.setEmail(parentEmail);
            guardian.setRole(UserRole.GUARDIAN);
            guardian.setStatus(AccountStatus.ACTIVE);
            guardian.setDisplayName("Parent");
            // Set a dummy password or handle passwordless creation properly
            guardian.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            guardian = userRepository.save(guardian);
        }

        if (learner.getGuardians() == null) {
            learner.setGuardians(new java.util.HashSet<>());
        }
        learner.getGuardians().add(guardian);

        if (guardian.getMonitoredLearners() == null) {
            guardian.setMonitoredLearners(new java.util.HashSet<>());
        }
        guardian.getMonitoredLearners().add(learner);

        userRepository.save(learner);
        userRepository.save(guardian);

        // Mock email sending
        System.out.println("Sending consent email to " + parentEmail + " for learner " + learner.getUsername());
    }
}
