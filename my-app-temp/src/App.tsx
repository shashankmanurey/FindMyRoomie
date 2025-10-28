import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AddPost from "./pages/AddPost";
import PostDetails from "./pages/PostDetails";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import api from "./services/api";
import Inbox from "./pages/Inbox";


export interface User {
  id: number;
  name: string;
  email: string;
  location?: string;
  profileImage?: string; // ✅ added to match Profile.tsx
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then(res => setUser(res.data))
      .catch(() => {
        /* ignore unauthenticated state */
      });
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/add" element={<AddPost user={user} />} />
          <Route path="/posts/:id" element={<PostDetails user={user} />} />
          <Route path="/chat/:userId" element={<ChatPage user={user} />} />
          <Route path="/inbox" element={<Inbox user={user} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
