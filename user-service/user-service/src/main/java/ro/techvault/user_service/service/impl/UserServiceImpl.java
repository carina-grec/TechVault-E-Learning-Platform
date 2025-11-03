package ro.techvault.user_service.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.techvault.user_service.dtos.CreateUserRequestDTO;
import ro.techvault.user_service.dtos.UserResponseDTO;
import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.models.Admin;
import ro.techvault.user_service.models.Guardian;
import ro.techvault.user_service.models.Learner;
import ro.techvault.user_service.models.User;
import ro.techvault.user_service.repositories.AdminRepository;
import ro.techvault.user_service.repositories.GuardianRepository;
import ro.techvault.user_service.repositories.LearnerRepository;
import ro.techvault.user_service.repositories.UserRepository;
import ro.techvault.user_service.service.UserService;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private GuardianRepository guardianRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User newUser;

        // Create the specific user type based on the role
        switch (request.getRole()) {
            case LEARNER:
                if (learnerRepository.existsByUsername(request.getUsername())) {
                    throw new RuntimeException("Username already in use");
                }
                Learner learner = new Learner();
                learner.setUsername(request.getUsername());
                learner.setAge(request.getAge());
                learner.setStatus(request.getAge() < 13 ? AccountStatus.PENDING_CONSENT : AccountStatus.ACTIVE);
                newUser = learner;
                break;
            case GUARDIAN:
                newUser = new Guardian();
                newUser.setStatus(AccountStatus.ACTIVE);
                break;
            case ADMIN:
                newUser = new Admin();
                newUser.setStatus(AccountStatus.ACTIVE);
                break;
            default:
                throw new RuntimeException("Invalid user role specified");
        }

        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(request.getPasswordHash());
        newUser.setRole(request.getRole());

        User savedUser = userRepository.save(newUser);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getStatus(),
                savedUser.getCreatedAt()
        );
    }

    @Override
    public UserResponseDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}