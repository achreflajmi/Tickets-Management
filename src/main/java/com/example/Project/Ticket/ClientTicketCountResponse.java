package com.example.Project.Ticket;

import lombok.Data;

// Add clientId to the response class if not already there
@Data
public class ClientTicketCountResponse {
    private long clientId;
    private long ticketCount;

    public ClientTicketCountResponse(long clientId, long ticketCount) {
        this.clientId = clientId;
        this.ticketCount = ticketCount;
    }

}
