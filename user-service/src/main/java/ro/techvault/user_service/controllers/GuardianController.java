package ro.techvault.user_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ro.techvault.user_service.dtos.GuardianLearnerResponse;
import ro.techvault.user_service.dtos.GuardianLinkRequest;
import ro.techvault.user_service.enums.UserRole;
import ro.techvault.user_service.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/guardians/me/learners")
public class GuardianController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<GuardianLearnerResponse>> getLinkedLearners(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader("X-User-Role") String roleHeader
    ) {
        UUID guardianId = parseGuardian(roleHeader, userIdHeader);
        return ResponseEntity.ok(userService.getGuardianLearners(guardianId));
    }

    @PostMapping
    public ResponseEntity<GuardianLearnerResponse> linkLearner(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader("X-User-Role") String roleHeader,
            @RequestBody GuardianLinkRequest request
    ) {
        UUID guardianId = parseGuardian(roleHeader, userIdHeader);
        GuardianLearnerResponse response = userService.linkGuardianToLearner(guardianId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private UUID parseGuardian(String roleHeader, String idHeader) {
        if (!UserRole.GUARDIAN.name().equalsIgnoreCase(roleHeader)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Guardian role required");
        }
        try {
            return UUID.fromString(idHeader);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid guardian id", ex);
        }
    }
}
