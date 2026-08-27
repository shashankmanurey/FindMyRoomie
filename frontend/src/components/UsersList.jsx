import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/users';

export default function UsersList({ onSelect, selectedId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Attempt to fetch all users. If your backend doesn't provide this endpoint,
    // replace this call with a fixed list or fetch known recipients.
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => {
        console.warn('Could not fetch users list', err);
        setUsers([]); // fallback to empty
      });
  }, []);

  return (
    <div className="users-list">
      <div className="section-kicker">Your people</div>
      <h3>Start a conversation</h3>
      <ul>
        {users.map(u => (
          <li key={u.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => onSelect(u)}
              className={`user-button ${u.id === selectedId ? 'is-selected' : ''}`}
            >
              <span className="avatar avatar-small">{(u.name || u.email || 'U').charAt(0).toUpperCase()}</span>
              <span>{u.name || u.email}</span>
            </button>
          </li>
        ))}
        {!users.length && <li className="empty-state compact">No users available yet.</li>}
      </ul>
    </div>
  );
}
