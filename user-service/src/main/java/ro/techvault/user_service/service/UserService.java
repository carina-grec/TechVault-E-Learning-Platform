package ro.techvault.user_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ro.techvault.user_service.dtos.AdminUserUpdateRequest;
import ro.techvault.user_service.dtos.ChangePasswordRequest;
import ro.techvault.user_service.dtos.CreateUserRequestDTO;
import ro.techvault.user_service.dtos.GuardianLearnerResponse;
import ro.techvault.user_service.dtos.GuardianLinkRequest;
import ro.techvault.user_service.dtos.InternalUserResponse;
import ro.techvault.user_service.dtos.UpdateProfileRequest;
import ro.techvault.user_service.dtos.UserProfileResponse;
import ro.techvault.user_service.dtos.UserResponseDTO;
import ro.techvault.user_service.enums.UserRole;

import java.util.UUID;

public interface UserService {
    UserResponseDTO createUser(CreateUserRequestDTO createUserRequestDTO);

    UserResponseDTO getUserById(UUID id);

    InternalUserResponse getUserDetailsByEmail(String email);

    UserProfileResponse getCurrentUserProfile(UUID userId);

    UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    Page<UserResponseDTO> getUsers(Pageable pageable, UserRole roleFilter);

    UserResponseDTO adminUpdateUser(UUID userId, AdminUserUpdateRequest request);

    java.util.List<GuardianLearnerResponse> getGuardianLearners(UUID guardianId);

    GuardianLearnerResponse linkGuardianToLearner(UUID guardianId, GuardianLinkRequest request);

    void initiateConsent(UUID userId, String parentEmail);
}
