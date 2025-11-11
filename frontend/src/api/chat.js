import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const connectWebSocket = (userId, onMessage) => {
  const socketFactory = () => new SockJS(WS_URL);

  const client = new Client({
    webSocketFactory: socketFactory,
    reconnectDelay: 5000,
    debug: () => {},
    onConnect: () => {
      console.log('STOMP connected');
      if (userId) {
        client.subscribe(`/user/${userId}/queue/messages`, (msg) => {
          try {
            onMessage(JSON.parse(msg.body));
          } catch (e) {
            console.error('Failed to parse message', e);
          }
        });
      }
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame);
    }
  });

  client.activate();

  // helper to send a chat message
  client.sendMessage = ({ senderId, recipientId, content, senderName }) => {
    if (!client.connected) {
      console.warn('STOMP client not connected yet');
      return;
    }
    const payload = {
      senderId,
      recipientId,
      content,
      senderName
    };
    // backend expects messages sent to /app/chat.send
    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload)
    });
  };

  return client;
};
