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
    <div style={{ width: 220, borderRight: '1px solid #ddd', padding: '0.5rem' }}>
      <h4>Users</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(u => (
          <li key={u.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => onSelect(u)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px',
                background: u.id === selectedId ? '#eee' : '#fff',
                border: '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              {u.name || u.email}
            </button>
          </li>
        ))}
        {!users.length && <li style={{ color: '#777' }}>No users available</li>}
      </ul>
    </div>
  );
}
