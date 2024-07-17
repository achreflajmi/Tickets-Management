package com.example.Project.Admin;

import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/tickets")
    public ResponseEntity<?> getAssignedTickets() {
        // implement logic to fetch tickets assigned to this admin
        return ResponseEntity.ok("Tickets fetched successfully.");
    }

    @PutMapping("/resolve-ticket/{ticketId}")
    public ResponseEntity<?> resolveTicket(@PathVariable Integer ticketId, @RequestBody String responseMessage) {
        // implement logic to resolve a ticket by responding to the client's chat
        return ResponseEntity.ok("Ticket resolved successfully.");
    }

    @GetMapping("/chats/{ticketId}")
    public ResponseEntity<?> getChatForTicket(@PathVariable Integer ticketId) {
        // implement logic to fetch chat for a ticket
        return ResponseEntity.ok("Chat fetched successfully.");
    }
}
