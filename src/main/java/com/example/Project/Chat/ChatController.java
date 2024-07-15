package com.example.Project.Chat;

import com.example.Project.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{ticketId}")
    public List<ChatMessageDTO> getChatMessages(@PathVariable int ticketId, Authentication authentication) {
        User authenticatedUser = (User) authentication.getPrincipal();
        return chatService.getChatMessages(ticketId, authenticatedUser);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendChatMessage(@RequestBody SendMessageRequest request,
                                             @RequestParam int ticketId,
                                             Authentication connectedUser) {
        try {
            // Validate request
            if (request == null || request.getMessageText() == null || request.getMessageText().isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid chat message.");
            }

            // Create ChatMessage object from the request
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setMessageText(request.getMessageText());

            // Get the sender from the authenticated user
            User sender = (User) connectedUser.getPrincipal();
            chatMessage.setSender(sender);

            // Save chat message
            chatService.saveChatMessage(chatMessage, ticketId, connectedUser);
            return ResponseEntity.ok("Chat message sent successfully.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while sending the chat message.");
        }
    }




}