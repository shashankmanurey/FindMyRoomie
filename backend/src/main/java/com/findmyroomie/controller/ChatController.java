package com.findmyroomie.controller;

import com.findmyroomie.model.ChatMessage;
import com.findmyroomie.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    // client should send to /app/chat.send
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatService.save(chatMessage);
        // send to recipient's queue
        messagingTemplate.convertAndSendToUser(chatMessage.getRecipientId().toString(), "/queue/messages", chatMessage);
    }
}
