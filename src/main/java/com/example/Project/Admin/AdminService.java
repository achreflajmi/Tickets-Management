package com.example.Project.Admin;

import com.example.Project.Ticket.Ticket;
import com.example.Project.Ticket.TicketRepository;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import com.example.Project.role.Role;
import com.example.Project.role.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;


//    public List<Ticket> getTicketsByAdminId(int adminId) {
//        return ticketRepository.findAllByAssignedAdminId(adminId);
//    }

}