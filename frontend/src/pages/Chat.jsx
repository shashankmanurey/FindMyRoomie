import React, { useContext, useState } from 'react';
import UsersList from '../components/UsersList';
import ChatBox from '../components/ChatBox';
import { AuthContext } from '../context/authContextValue';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);

  if (!user) return <div className="empty-page"><h2>Log in to use messages.</h2></div>;

  return (
    <div className="chat-layout">
      <UsersList onSelect={(u) => setRecipient(u)} selectedId={recipient?.id} />
      <ChatBox userId={user.id} recipient={recipient} />
    </div>
  );
}
