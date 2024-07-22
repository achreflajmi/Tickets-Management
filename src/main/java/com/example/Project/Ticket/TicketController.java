package com.example.Project.Ticket;

import com.example.Project.Common.PageResponse;
import com.example.Project.Exception.OperationNotPermittedException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("tickets")
@RequiredArgsConstructor
@Tag(name = "Ticket")
public class TicketController {

    private final TicketService service;

    private final TicketMapper ticketMapper;
    @PostMapping
    public ResponseEntity<Integer> saveTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication connectedUser
    ) {
        System.out.println("Received ticket: " + request);

        return ResponseEntity.ok(service.save(request, connectedUser));
    }

    @GetMapping("/{ticket-id}")
    public ResponseEntity<TicketResponse> findTicketById(
            @PathVariable("ticket-id") int ticketId
    ) {
        return ResponseEntity.ok(service.findById(ticketId));
    }
    @PostMapping("/{ticket-id}/close")
    public ResponseEntity<String> closeTicket(@PathVariable("ticket-id") int ticketId,
                                              Authentication authentication) {
        try {
            int closedTicketId = service.closeTicket(ticketId, authentication);
            return ResponseEntity.ok("Ticket with ID " + closedTicketId + " closed successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (OperationNotPermittedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<PageResponse<TicketResponse>> findAllTickets(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.findAllTickets(page, size, connectedUser));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = service.getAllTickets().stream()
                .map(ticketMapper::toTicketResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/by-user")
    public ResponseEntity<PageResponse<TicketResponse>> getTicketsByUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String userId,
            Authentication authentication
    ) {
        PageResponse<TicketResponse> response = service.getTicketsByUser(page, size, userId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/user")
    public ResponseEntity<PageResponse<TicketResponse>> findAllTicketsByUser(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.findAllTicketsByUser(page, size, connectedUser));
    }

    @PatchMapping("/{ticket-id}")
    public ResponseEntity<Integer> updateTicket(
            @PathVariable("ticket-id") int ticketId,
            @Valid @RequestBody TicketRequest updatedTicket,
            Authentication connectedUser
    ) {
        System.out.println("Received ticket update request: " + updatedTicket);
        return ResponseEntity.ok(service.updateTicket(ticketId, updatedTicket, connectedUser));
    }

    @DeleteMapping("/{ticket-id}")
    public ResponseEntity<Integer> deleteTicket(
            @PathVariable("ticket-id") int ticketId,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.deleteTicket(ticketId, connectedUser));
    }
}
