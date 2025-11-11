import React, { useContext, useState } from 'react';
import UsersList from '../components/UsersList';
import ChatBox from '../components/ChatBox';
import { AuthContext } from '../context/AuthContext';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [recipient, setRecipient] = useState(null);

  if (!user) return <p>Please login to use chat.</p>;

  return (
    <div style={{ display: 'flex', gap: 12, padding: 12 }}>
      <UsersList onSelect={(u) => setRecipient(u)} selectedId={recipient?.id} />
      <ChatBox userId={user.id} recipient={recipient} />
    </div>
  );
}
