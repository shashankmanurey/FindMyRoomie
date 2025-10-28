import React, { useEffect, useState } from "react";
import axios from "axios";

interface ChatSession {
  id: number;
  user1: string;
  user2: string;
}

interface Props {
  currentUser: string;
  onSelectChat: (chatWith: string) => void;
}

const Inbox: React.FC<Props> = ({ currentUser, onSelectChat }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/chat/inbox/${currentUser}`)
      .then((res) => setSessions(res.data));
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-white shadow w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-2">Inbox</h3>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        sessions.map((s) => {
          const chatWith = s.user1 === currentUser ? s.user2 : s.user1;
          return (
            <div
              key={s.id}
              onClick={() => onSelectChat(chatWith)}
              className="cursor-pointer border-b py-2 hover:bg-gray-100"
            >
              {chatWith}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Inbox;
