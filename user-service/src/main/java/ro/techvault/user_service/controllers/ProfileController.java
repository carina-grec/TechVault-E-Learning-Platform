package ro.techvault.user_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ro.techvault.user_service.dtos.ChangePasswordRequest;
import ro.techvault.user_service.dtos.UpdateProfileRequest;
import ro.techvault.user_service.dtos.UserProfileResponse;
import ro.techvault.user_service.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/me")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(
            @RequestHeader("X-User-Id") String userIdHeader
    ) {
        UUID userId = parseUserId(userIdHeader);
        return ResponseEntity.ok(userService.getCurrentUserProfile(userId));
    }

    @PatchMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        UUID userId = parseUserId(userIdHeader);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(parseUserId(userIdHeader), request);
        return ResponseEntity.noContent().build();
    }

    private UUID parseUserId(String header) {
        if (header == null || header.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }
        try {
            return UUID.fromString(header);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user identifier", ex);
        }
    }
}
