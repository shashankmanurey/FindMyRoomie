import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { User } from "../App";

interface Message {
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

const ChatWindow: React.FC<{ user: User | null }> = ({ user }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  // Fetch previous chat messages
  useEffect(() => {
    if (!chatId) return;
    api.get(`/api/chat/${chatId}`).then((r) => setMessages(r.data));
  }, [chatId]);

  // WebSocket Connection
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to chat server");

      client.subscribe(`/topic/messages/${chatId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    client.activate();
    setStompClient(client);

    // ✅ cleanup (sync)
    return () => {
      client.deactivate();
      console.log("❌ Disconnected from chat server");
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!message.trim() || !user || !stompClient) return;

    const msg = {
      senderId: user.id,
      receiverId: Number(chatId),
      content: message,
      timestamp: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(msg),
    });

    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>
        Chat with User {chatId}
      </h2>

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          padding: 12,
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            No messages yet.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.senderId === user?.id ? "flex-end" : "flex-start",
              margin: "8px 0",
            }}
          >
            <div
              style={{
                background:
                  msg.senderId === user?.id ? "#4f46e5" : "#e5e7eb",
                color: msg.senderId === user?.id ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "70%",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            padding: "8px 10px",
            borderRadius: 6,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            borderRadius: 6,
            padding: "8px 14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
