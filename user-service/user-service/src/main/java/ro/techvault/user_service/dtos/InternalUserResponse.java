package ro.techvault.user_service.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ro.techvault.user_service.enums.AccountStatus;
import ro.techvault.user_service.enums.UserRole;

import java.util.UUID;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class InternalUserResponse {
    UUID id;
    String email;
    String passwordHash;
    UserRole role;
    AccountStatus status;
}
