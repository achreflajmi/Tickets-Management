package com.example.Project.Ticket;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TicketRequest {
    private int id;
    @NotNull(message = "100")
    @NotEmpty(message = "subject must not be empty")
    private String subject;
    private Ticket.Type type;
    private LocalDate date;
    private Ticket.Status status;
    @NotNull(message = "103")
    @NotEmpty(message = "username must not be empty")
    private String username;
    private Ticket.Priority priority;

}