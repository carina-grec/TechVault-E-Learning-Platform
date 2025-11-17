package ro.techvault.user_service.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChangePasswordRequest(
        @JsonProperty("currentPassword") String oldPassword,
        String newPassword
) {
}
