package com.example.Project.Ticket;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TicketResponse {
    private int id;
    private String subject;
    private String username;
    private LocalDate date;
    private Ticket.Type type;
    private Ticket.Status status;
    private Ticket.Priority priority;

}
