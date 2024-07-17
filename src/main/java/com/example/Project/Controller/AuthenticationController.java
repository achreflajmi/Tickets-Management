package com.example.Project.Controller;

import com.example.Project.Security.CustomUserDetails;
import com.example.Project.Security.JwtService;
import com.example.Project.User.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final JwtService jwtService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegestrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/register-super-admin")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> registerSuperAdmin(
            @RequestBody @Valid RegestrationRequest request
    ) throws MessagingException {
        service.registerSuperAdmin(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/register-admin")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> registerAdmin(
            @RequestBody @Valid RegestrationRequest request
    ) throws MessagingException {
        service.registerAdmin(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
    }
    @GetMapping("/USER")
    public ResponseEntity<CustomUserDetails> getLoggedInUser(@RequestHeader("Authorization") String authorizationHeader) {
        // Extract JWT token from Authorization header (Bearer token)
        String token = authorizationHeader.substring("Bearer ".length()).trim();

        // Get CustomUserDetails from JwtService
        CustomUserDetails userDetails = jwtService.getLoggedInUser(token);

        // Return CustomUserDetails with OK status
        return ResponseEntity.ok().body(userDetails);
    }

    @GetMapping("/admin/data")
    public ResponseEntity<String> getAdminData() {
        return ResponseEntity.ok("This is data only accessible to admins");
    }

    @GetMapping("/super-admin/data")
    public ResponseEntity<String> getSuperAdminData() {
        return ResponseEntity.ok("This is data only accessible to super admins");
    }

}
