package com.example.Project.Ticket;
import lombok.Data;

@Data
public class AdminTicketCountResponse {
    private Integer adminId;
    private Long ticketCount;

    public AdminTicketCountResponse(Integer adminId, Long ticketCount) {
        this.adminId = adminId;
        this.ticketCount = ticketCount;
    }

    // Getters and setters
}