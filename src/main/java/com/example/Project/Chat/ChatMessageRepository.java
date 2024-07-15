package com.example.Project.Chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByTicketIdOrderByTimestampAsc(int ticketId);

    List<ChatMessage> findByTicketId(int ticketId);
}
