package ro.techvault.user_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import ro.techvault.user_service.dtos.AdminUserUpdateRequest;
import ro.techvault.user_service.dtos.UserResponseDTO;
import ro.techvault.user_service.enums.UserRole;
import ro.techvault.user_service.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> listUsers(
            @RequestHeader("X-User-Role") String roleHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) UserRole role
    ) {
        ensureAdmin(roleHeader);
        Page<UserResponseDTO> response = userService.getUsers(PageRequest.of(page, size), role);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @RequestHeader("X-User-Role") String roleHeader,
            @PathVariable UUID userId,
            @RequestBody AdminUserUpdateRequest request
    ) {
        ensureAdmin(roleHeader);
        return ResponseEntity.ok(userService.adminUpdateUser(userId, request));
    }

    private void ensureAdmin(String roleHeader) {
        if (!UserRole.ADMIN.name().equalsIgnoreCase(roleHeader)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
    }
}
