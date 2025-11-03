package ro.techvault.authservice.service.impl;

import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ro.techvault.authservice.clients.UserServiceClient;
import ro.techvault.authservice.dtos.*;
import ro.techvault.authservice.enums.AccountStatus;
import ro.techvault.authservice.security.JwtTokenProvider;
import ro.techvault.authservice.service.AuthFacade;

@Service
public class AuthFacadeImpl implements AuthFacade {

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse registerNewUser(RegistrationRequest request) {

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        CreateUserRequestDTO userRequest = new CreateUserRequestDTO(
                request.getEmail(),
                hashedPassword,
                request.getRole(),
                request.getUsername(),
                request.getAge()
        );


        UserResponseDTO userResponse = userServiceClient.createUser(userRequest);

        String jwtToken = jwtTokenProvider.generateToken(
                userResponse.getId(),
                userResponse.getRole()
        );

        return new AuthResponse(
                jwtToken,
                userResponse.getId(),
                userResponse.getEmail(),
                userResponse.getRole()
        );
    }

    private static final Logger log = LoggerFactory.getLogger(AuthFacadeImpl.class);

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        InternalUserResponse user;

        // --- STEP 1: Find user by email ---
        try {
            user = userServiceClient.getUserDetailsByEmail(request.getEmail());
            // CRITICAL LOG: Let's see what the user object looks like after the Feign call
            log.info("User details received from user-service: {}", user);

        } catch (FeignException.NotFound e) {
            log.warn("User not found by email: {}", request.getEmail());
            // User-service returned a 404 (user not found)
            throw new BadCredentialsException("Invalid email or password");
        } catch (Exception e) {
            // Catch any other Feign or deserialization errors
            log.error("Error during Feign call to user-service: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching user details", e);
        }

        // --- Null check for safety ---
        if (user == null) {
            log.error("User object is null after Feign call, despite no exception.");
            throw new BadCredentialsException("Invalid email or password");
        }

        // --- STEP 2: Check password ---
        // Be careful logging sensitive data. We log the *result* only.
        if (user.passwordHash() == null) {
            log.error("User object has null password hash. DTO mapping failed.");
            throw new BadCredentialsException("Invalid email or password");
        }
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.passwordHash());
        log.info("Password match result for {}: {}", request.getEmail(), passwordMatches);

        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // --- STEP 3: Check account status ---
        log.info("Checking account status for {}. Status is: {}", user.email(), user.status());

        if (user.status() != AccountStatus.ACTIVE) {
            log.warn("Login failed for {}: Account status is {}.", user.email(), user.status());
            if (user.status() == AccountStatus.PENDING_CONSENT) {
                throw new RuntimeException("Account is pending guardian consent.");
            }
            if (user.status() == AccountStatus.SUSPENDED) {
                throw new RuntimeException("Account is suspended.");
            }
            // This is likely hit if user.status() is null
            throw new RuntimeException("Account is not active.");
        }

        // --- STEP 4: Generate a JWT token ---
        log.info("Login successful, generating token for user ID: {}", user.id());
        String jwtToken = jwtTokenProvider.generateToken(
                user.id(),
                user.role()
        );

        // --- STEP 5: Return the response ---
        return new AuthResponse(
                jwtToken,
                user.id(),
                user.email(),
                user.role()
        );
    }
}