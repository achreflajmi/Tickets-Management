package com.example.Project.Ticket;

import org.springframework.stereotype.Service;

@Service
public class TicketMapper {

    public Ticket toTicket(TicketRequest request) {
        return Ticket.builder()
                .subject(request.getSubject())
                .username(request.getUsername())
                .date(request.getDate())
                .type(request.getType())
                .priority(request.getPriority())
                .status(request.getStatus())
                .build();
    }

    public TicketResponse toTicketResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .subject(ticket.getSubject())
                .date(ticket.getDate())
                .type(ticket.getType())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .username(ticket.getUser().getUsername())
                .build();
    }
}
