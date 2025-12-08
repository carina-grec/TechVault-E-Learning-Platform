package ro.techvault.user_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.techvault.user_service.dtos.CreateUserRequestDTO;
import ro.techvault.user_service.dtos.InternalUserResponse;
import ro.techvault.user_service.dtos.UserResponseDTO;
import ro.techvault.user_service.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/internal/create")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody CreateUserRequestDTO request) {
        UserResponseDTO newUser = userService.createUser(request);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping(value = "/internal/email/{email}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InternalUserResponse> getUserDetailsByEmail(@PathVariable String email) {
        InternalUserResponse userDetails = userService.getUserDetailsByEmail(email);
        return ResponseEntity.ok(userDetails);
    }

    @PostMapping("/{id}/consent-request")
    public ResponseEntity<Void> initiateConsent(@PathVariable UUID id, @RequestBody String parentEmail) {
        userService.initiateConsent(id, parentEmail);
        return ResponseEntity.ok().build();
    }
}