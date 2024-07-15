package com.example.Project.Chat;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class ChatMessageDTO {
    private final LocalDateTime timestamp;
    private String messageText;
    private String senderName;

    public ChatMessageDTO(LocalDateTime timestamp, String messageText, String senderName) {
        this.timestamp = timestamp;
        this.messageText = messageText;
        this.senderName = senderName;
    }


    public ChatMessageDTO(String messageText, String senderName, LocalDateTime timestamp) {
        this.messageText = messageText;
        this.senderName = senderName;
        this.timestamp = timestamp;
    }
}
