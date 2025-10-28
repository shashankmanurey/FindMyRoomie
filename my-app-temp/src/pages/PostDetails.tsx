import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { User } from "../App";
import axios from "axios";

const PostDetails: React.FC<{ user: User | null }> = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/rooms/${id}`)
      .then((r) => setPost(r.data))
      .catch(() => {});
  }, [id]);

  if (!post)
    return (
      <div style={{ maxWidth: 720, margin: "40px auto" }} className="card">
        Loading...
      </div>
    );

  const messagePoster = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.id === post.user.id) {
      alert("This is your own post.");
      return;
    }

    try {
      // ✅ Start or get existing chat between these two users
      const res = await axios.post("http://localhost:8080/api/chat/start", {
        senderId: user.id,
        receiverId: post.user.id,
      });

      // Navigate to chat window with the chatId returned from backend
      navigate(`/chat/${res.data.chatId}`);
    } catch (err) {
      console.error("Failed to start chat", err);
      alert("Something went wrong while starting the chat.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 20,
      }}
    >
      <div className="card">
        <img
          src={post.image || "https://source.unsplash.com/1200x800/?room"}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        <h2 style={{ marginTop: 12 }}>{post.title}</h2>
        <p style={{ color: "#6b7280" }}>{post.desc}</p>
        <div style={{ fontWeight: 600, marginTop: 8 }}>
          {post.price} • {post.area}
        </div>
      </div>

      <div>
        <div className="card">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={
                post.user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              style={{ width: 64, height: 64, borderRadius: 999 }}
            />
            <div>
              <div style={{ fontWeight: 700 }}>{post.user.name}</div>
              <div style={{ color: "#6b7280" }}>{post.user.location}</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              onClick={messagePoster}
              style={{
                padding: "8px 12px",
                background: "#4f46e5",
                color: "white",
                borderRadius: 6,
              }}
            >
              💬 Message Poster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
