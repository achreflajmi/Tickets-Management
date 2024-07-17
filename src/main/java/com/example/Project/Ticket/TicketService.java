package com.example.Project.Ticket;

import com.example.Project.Common.PageResponse;
import com.example.Project.Exception.OperationNotPermittedException;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.example.Project.Ticket.TicketSpecification.withUserId;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketMapper ticketMapper;

    public int save(TicketRequest request, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Ticket ticket = ticketMapper.toTicket(request);
        ticket.setUser(user);
        return ticketRepository.save(ticket).getId();
    }

    public TicketResponse findById(int ticketId) {
        return ticketRepository.findById(ticketId)
                .map(ticketMapper::toTicketResponse)
                .orElseThrow(() -> new EntityNotFoundException("No ticket found with ID:: " + ticketId));
    }

    public PageResponse<TicketResponse> findAllTickets(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<Ticket> tickets = ticketRepository.findAll(pageable);
        List<TicketResponse> ticketResponses = tickets.stream()
                .map(ticketMapper::toTicketResponse)
                .toList();
        return new PageResponse<>(
                ticketResponses,
                tickets.getNumber(),
                tickets.getSize(),
                tickets.getTotalElements(),
                tickets.getTotalPages(),
                tickets.isFirst(),
                tickets.isLast()
        );
    }

    public PageResponse<TicketResponse> findAllTicketsByUser(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<Ticket> tickets = ticketRepository.findAll(withUserId(user.getId()), pageable);
        List<TicketResponse> ticketResponses = tickets.stream()
                .map(ticketMapper::toTicketResponse)
                .toList();
        return new PageResponse<>(
                ticketResponses,
                tickets.getNumber(),
                tickets.getSize(),
                tickets.getTotalElements(),
                tickets.getTotalPages(),
                tickets.isFirst(),
                tickets.isLast()
        );
    }

    public PageResponse<TicketResponse> getTicketsByUser(int page, int size, String userId) {
        // Retrieve user based on userId
        User user = userRepository.findByEmail(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + userId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<Ticket> tickets = ticketRepository.findAll(withUserId(user.getId()), pageable);
        List<TicketResponse> ticketResponses = tickets.stream()
                .map(ticketMapper::toTicketResponse)
                .toList();
        return new PageResponse<>(
                ticketResponses,
                tickets.getNumber(),
                tickets.getSize(),
                tickets.getTotalElements(),
                tickets.getTotalPages(),
                tickets.isFirst(),
                tickets.isLast()
        );
    }

    public int updateTicket(int ticketId, TicketRequest updatedTicket, Authentication connectedUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("No ticket found with ID:: " + ticketId));
        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(ticket.getUser().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others tickets");
        }

        ticket.setSubject(updatedTicket.getSubject());
        ticket.setType(updatedTicket.getType());
        ticket.setStatus(updatedTicket.getStatus());
        ticket.setUsername(updatedTicket.getUsername());
        ticket.setDate(updatedTicket.getDate());
        ticket.setPriority(updatedTicket.getPriority());

        ticketRepository.save(ticket);
        return ticketId;
    }

    public int closeTicket(int ticketId, Authentication connectedUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("No ticket found with ID: " + ticketId));

        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(ticket.getUser().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot close others' tickets");
        }

        ticket.setStatus(Ticket.Status.Closed);
        ticket.setClosureDate(LocalDate.now());
        ticketRepository.save(ticket);

        return ticket.getId();
    }

    public int deleteTicket(int ticketId, Authentication connectedUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("No ticket found with ID:: " + ticketId));
        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(ticket.getUser().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot delete others tickets");
        }

        ticketRepository.delete(ticket);
        return ticketId;
    }

    public List<Ticket> getTicketsByAdmin(User admin) {
        return ticketRepository.findByAssignedAdmin(admin);
    }

    @Transactional
    public void assignTicketToAdmin(Integer ticketId, Integer adminId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));
        ticket.setAssignedAdmin(admin);
        ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }


    public List<Ticket> getTicketsByUser(User user) {
        return ticketRepository.findByUser(user);
    }
}

