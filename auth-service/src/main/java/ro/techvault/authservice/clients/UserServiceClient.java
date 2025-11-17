package ro.techvault.authservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ro.techvault.authservice.dtos.CreateUserRequestDTO;
import ro.techvault.authservice.dtos.InternalUserResponse;
import ro.techvault.authservice.dtos.UserResponseDTO;

import java.util.UUID;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    @PostMapping("/api/users/internal/create")
    UserResponseDTO createUser(@RequestBody CreateUserRequestDTO request);

    @GetMapping("/api/users/internal/email/{email}")
    InternalUserResponse getUserDetailsByEmail(@PathVariable("email") String email);

    @GetMapping("/api/users/{id}")
    UserResponseDTO getUserById(@PathVariable("id") UUID id);
}
