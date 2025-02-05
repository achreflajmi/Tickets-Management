package com.example.Project.Controller;

import com.example.Project.Exception.CustomAuthenticationException;
import com.example.Project.Security.CustomUserDetails;
import com.example.Project.Security.JwtService;
import com.example.Project.User.Token;
import com.example.Project.User.TokenRepository;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import com.example.Project.email.EmailService;
import com.example.Project.email.EmailTemplateName;
import com.example.Project.role.RoleRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Project.role.Role;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegestrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        try {
            var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .roles(List.of(userRole))
                    .build();

            userRepository.save(user);
            sendValidationEmail(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to register user due to database constraint violation", e);
        } catch (Exception e) {
            throw new MessagingException("Failed to register user: " + e.getMessage(), e);
        }
    }

    public void registerAdmin(RegestrationRequest request) throws MessagingException {
        var adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE ADMIN was not initiated"));

        try {
            var admin = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .roles(List.of(adminRole))
                    .build();

            userRepository.save(admin);
            sendValidationEmail(admin);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to register admin due to database constraint violation", e);
        } catch (Exception e) {
            throw new MessagingException("Failed to register admin: " + e.getMessage(), e);
        }
    }

    public void registerSuperAdmin(RegestrationRequest request) throws MessagingException {
        var superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE SUPER_ADMIN was not initiated"));

        try {
            var superAdmin = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .roles(List.of(superAdminRole))
                    .build();

            userRepository.save(superAdmin);
            sendValidationEmail(superAdmin);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to register super admin due to database constraint violation", e);
        } catch (Exception e) {
            throw new MessagingException("Failed to register super admin: " + e.getMessage(), e);
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Create CustomUserDetails instance
            var customUserDetails = new CustomUserDetails(user);

            var auth = new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword(),
                    user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority(role.getName()))
                            .collect(Collectors.toList())
            );

            authenticationManager.authenticate(auth);

            // Use CustomUserDetails instead of User
            var jwtToken = jwtService.generateToken(customUserDetails);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .roles(user.getRoles().stream()
                            .map(Role::getName)
                            .collect(Collectors.toList()))  // Include roles in response
                    .build();
        } catch (AuthenticationException ex) {
            throw new CustomAuthenticationException("Invalid email or password", ex); // Custom exception with error message
        }
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent to the same email address");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    @Transactional
    public void modifyAdmin(Integer userId, RegestrationRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Admin not found"));
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(int userId) {
        // Delete tokens first
        tokenRepository.deleteByUserId(userId);
        // Then delete the user
        userRepository.deleteById(userId);
    }

    @Transactional
    public void addAdmin(RegestrationRequest request) throws MessagingException {
        var adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE ADMIN was not initiated"));

        try {
            var admin = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(true) // Admin accounts are enabled by default
                    .roles(List.of(adminRole))
                    .build();

            userRepository.save(admin);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to add admin due to database constraint violation", e);
        }
    }
    public void addClient(RegestrationRequest request) throws MessagingException {
        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singletonList(roleRepository.findByName("USER").orElseThrow()));
        user.setEnabled(true);
        userRepository.save(user);
        // Add logic to send an email to the user if needed
    }

    public void modifyClient(Integer userId, RegestrationRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
}
