package ro.techvault.authservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import ro.techvault.authservice.dtos.CreateUserRequestDTO;
import ro.techvault.authservice.dtos.InternalUserResponse;
import ro.techvault.authservice.dtos.UserResponseDTO;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    @PostMapping("/api/users/internal/create")
    UserResponseDTO createUser(@RequestBody CreateUserRequestDTO request);

    @GetMapping("/api/users/internal/email/{email}")
    InternalUserResponse getUserDetailsByEmail(@PathVariable("email") String email);
}