import { useEffect, useState, useRef, useContext } from "react";
import { connectWebSocket } from "../api/chat";
import { AuthContext } from "../context/AuthContext";

export default function ChatBox({ userId }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipientId, setRecipientId] = useState(""); // optional: target user ID
  const clientRef = useRef(null);

  // connect WebSocket and handle incoming messages
  useEffect(() => {
    if (!userId) return;

    const client = connectWebSocket(userId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    clientRef.current = client;

    return () => {
      try {
        client.deactivate();
      } catch (err) {
        console.error("Error closing WebSocket:", err);
      }
    };
  }, [userId]);

  // send message through WebSocket
  const send = (e) => {
    e.preventDefault(); // prevents form refresh

    if (!text.trim()) return;
    if (!clientRef.current || !clientRef.current.connected) {
      alert("Chat not connected yet.");
      return;
    }

    const payload = {
      senderId: userId,
      recipientId: recipientId || null,
      content: text.trim(),
      senderName: user?.name || user?.email || "Unknown",
    };

    clientRef.current.sendMessage(payload);
    setMessages((prev) => [...prev, payload]); // optimistic update
    setText("");
  };

  return (
    <div className="chat-box">
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: 8,
          marginBottom: 8,
          background: "#fff",
          borderRadius: 6,
        }}
      >
        {messages.length === 0 && <p>No messages yet</p>}
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.senderName || m.senderId}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Recipient ID (optional)"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          style={{ width: 130 }}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
