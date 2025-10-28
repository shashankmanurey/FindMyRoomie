import React, { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard, { type Room } from "../components/RoomCard";
import type { User } from "../App";
import { useNavigate } from "react-router-dom";

interface ChatPreview {
  chatId: string;
  otherUser: { id: number; name: string; profileImage?: string };
  lastMessage?: string;
}

const Home: React.FC<{ user: User | null }> = ({ user }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/rooms").then((r) => setRooms(r.data));
  }, []);

  // 📨 Load inbox chats for logged-in user
  useEffect(() => {
    if (!user) return;
    api
      .get(`/api/chat/user/${user.id}`)
      .then((res) => setChats(res.data))
      .catch(() => {});
  }, [user]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
      <div>
        <h2>Room Posts</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 16,
          }}
        >
          {rooms.map((r) => (
            <RoomCard
              key={r.id}
              room={r}
              canEdit={user?.id === r.userId}
              onDelete={() => {
                if (!user) return;
                api
                  .delete(`/api/rooms/${r.id}`)
                  .then(() =>
                    setRooms((prev) => prev.filter((x) => x.id !== r.id))
                  );
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="card">
          {!user ? (
            <>
              <h3>Welcome!</h3>
              <p>
                FindMyRoomie helps you find roommates or rooms that suit your
                preferences. Please log in to add posts or chat!
              </p>
            </>
          ) : (
            <>
              <h3>{user.name}</h3>
              <p>{user.location}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => navigate("/add")}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "#4f46e5",
                    color: "white",
                  }}
                >
                  Add Post
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  style={{ padding: "8px 10px", borderRadius: 6 }}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>

        {user && (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>📥 Inbox</h3>
            {chats.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No messages yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {chats.map((chat) => (
                  <div
                    key={chat.chatId}
                    onClick={() => navigate(`/chat/${chat.chatId}`)}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "#f9fafb",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={
                        chat.otherUser.profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt=""
                      style={{ width: 40, height: 40, borderRadius: 999 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {chat.otherUser.name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 14 }}>
                        {chat.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
