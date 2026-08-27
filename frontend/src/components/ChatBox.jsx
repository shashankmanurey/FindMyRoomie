import { useEffect, useState, useRef, useContext } from "react";
import { connectWebSocket } from "../api/chat";
import { AuthContext } from "../context/authContextValue";

export default function ChatBox({ userId, recipient }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
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
      alert("Chat is still connecting. Please try again in a moment.");
      return;
    }

    const payload = {
      senderId: userId,
      recipientId: recipient?.id || null,
      content: text.trim(),
      senderName: user?.name || user?.email || "Unknown",
    };

    clientRef.current.sendMessage(payload);
    setMessages((prev) => [...prev, payload]); // optimistic update
    setText("");
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div><span className="section-kicker">Private messages</span><h2>{recipient ? `Chat with ${recipient.name || recipient.email}` : "Choose a roomie"}</h2></div>
        <span className="status-dot">Live</span>
      </div>
      <div className="messages">
        {messages.length === 0 && <p className="empty-state">{recipient ? "Your conversation starts here." : "Pick someone from the list to start chatting."}</p>}
        {messages.map((m, i) => (
          <div className={`message ${m.senderId === userId ? "message-own" : ""}`} key={i}>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <form className="message-form" onSubmit={send}>
        <input
          type="text"
          placeholder={recipient ? "Write a message..." : "Select a roomie first"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!recipient}
        />
        <button className="button button-primary" type="submit" disabled={!recipient}>Send</button>
      </form>
    </div>
  );
}
