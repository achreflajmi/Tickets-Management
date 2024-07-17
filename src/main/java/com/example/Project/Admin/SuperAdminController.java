package com.example.Project.Admin;

import com.example.Project.Chat.ChatService;
import com.example.Project.Controller.AuthenticationService;
import com.example.Project.Controller.RegestrationRequest;
import com.example.Project.Ticket.TicketResponse;
import com.example.Project.Ticket.TicketService;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import com.example.Project.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/superAdmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final TicketService ticketService;
    private final ChatService chatService;
    private final EmailService emailService;
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> allUsers = userRepository.findAll();
        List<User> admins = allUsers.stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("ADMIN")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(admins);
    }

    @DeleteMapping("/delete-admin/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable int id) {
        authenticationService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/modify-admin/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> modifyAdmin(@PathVariable Integer userId, @RequestBody RegestrationRequest request) {
        authenticationService.modifyAdmin(userId, request);
        return ResponseEntity.ok("Admin modified successfully.");
    }

    @PostMapping("/addAdmin")
    public void addAdmin(@RequestBody RegestrationRequest request) {

        try {
            authenticationService.addAdmin(request);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to add admin: " + e.getMessage(), e);
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PutMapping("/assign-ticket/{ticketId}/admin/{adminId}")
    public ResponseEntity<?> assignTicketToAdmin(@PathVariable Integer ticketId, @PathVariable Integer adminId) {
        ticketService.assignTicketToAdmin(ticketId, adminId);
        return ResponseEntity.ok("Ticket assigned to admin successfully.");
    }

    @GetMapping("/chats/{ticketId}")
    public ResponseEntity<?> getChatForTicket(@PathVariable Integer ticketId, User authenticatedUser) {
        TicketResponse ticket = ticketService.findById(ticketId);
        return ResponseEntity.ok(chatService.getChatMessages(ticketId, authenticatedUser));
    }
    @PostMapping("/send-email")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> sendEmailToAdmin(@RequestParam Integer adminId, @RequestParam String subject, @RequestParam String message) {
        try {
            // Fetch the admin's email from the database
            User admin = userRepository.findById(adminId)
                    .orElseThrow(() -> new EntityNotFoundException("Admin not found"));

            String adminEmail = admin.getEmail();

            emailService.sendEmailSuper(adminEmail, subject, message);
            return ResponseEntity.ok().build();
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint is working!");
    }
}
