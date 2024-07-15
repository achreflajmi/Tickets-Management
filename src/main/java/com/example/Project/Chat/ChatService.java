package com.example.Project.Chat;

import com.example.Project.Ticket.Ticket;
import com.example.Project.Ticket.TicketRepository;
import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import com.example.Project.role.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository; // Add Ticket repository dependency

    public List<ChatMessageDTO> getChatMessages(int ticketId, User authenticatedUser) {
        return chatMessageRepository.findByTicketId(ticketId)
                .stream()
                .filter(message -> message.getSender().getId().equals(authenticatedUser.getId()))
                .map(message -> new ChatMessageDTO( message.getTimestamp(),message.getMessageText(), message.getSenderName()))
                .collect(Collectors.toList());
    }
    public void saveChatMessage(ChatMessage chatMessage, int ticketId, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        User sender = userRepository.findById(chatMessage.getSender().getId()).orElse(null);
        chatMessage.setSender(sender);

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid ticket ID"));

        chatMessage.setTicket(ticket); // Associate ChatMessage with Ticket

        if (sender == null) {
            throw new IllegalArgumentException("Invalid sender ID");
        }

        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setSenderName(sender.getUsername());
        chatMessage.setSenderRole(sender.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(",")));

        chatMessageRepository.save(chatMessage);
        System.out.println("Chat message saved successfully.");
    }

}
