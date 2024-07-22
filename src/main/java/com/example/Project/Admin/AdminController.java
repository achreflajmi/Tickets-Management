package com.example.Project.Admin;

import com.example.Project.Ticket.Ticket;
import com.example.Project.Ticket.TicketService;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    @Autowired
    private TicketService ticketService;
    @GetMapping("/tickets/{adminId}")
    public List<Ticket> getTicketsByAdmin(@PathVariable int adminId) {
        return ticketService.getTicketsByAdminId(adminId);
    }

}
