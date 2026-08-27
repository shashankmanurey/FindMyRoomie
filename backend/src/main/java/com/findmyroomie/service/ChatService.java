package com.findmyroomie.service;

import com.findmyroomie.model.ChatMessage;
import com.findmyroomie.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatMessage save(ChatMessage msg) {
        return chatMessageRepository.save(msg);
    }

    public List<ChatMessage> history(Long userA, Long userB) {
        // Fetch both directions of conversation
        List<ChatMessage> messagesA = chatMessageRepository.findBySenderIdAndRecipientIdOrderBySentAtAsc(userA, userB);
        List<ChatMessage> messagesB = chatMessageRepository.findBySenderIdAndRecipientIdOrderBySentAtAsc(userB, userA);

        // Merge both and sort by sent time
        messagesA.addAll(messagesB);
        messagesA.sort((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()));
        return messagesA;
    }
}
