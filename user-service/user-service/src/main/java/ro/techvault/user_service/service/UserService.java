package ro.techvault.user_service.service;

import ro.techvault.user_service.dtos.CreateUserRequestDTO;
import ro.techvault.user_service.dtos.UserResponseDTO;

import java.util.UUID;

public interface UserService {
    UserResponseDTO createUser(CreateUserRequestDTO createUserRequestDTO);
    UserResponseDTO getUserById(UUID id);
}
