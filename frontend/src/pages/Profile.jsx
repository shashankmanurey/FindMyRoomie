import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateMe } from '../api/users'; // removed getUser (unused)

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatarUrl: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  if (!user) return <p>Not logged in.</p>;

  const save = async () => {
    try {
      const res = await updateMe(form);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Profile</h2>

      {!editing ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              style={{ width: 100, height: 100, borderRadius: '50%' }}
            />
          )}
          <br />
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <div style={{ maxWidth: 500 }}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <label>Avatar URL</label>
          <input
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
