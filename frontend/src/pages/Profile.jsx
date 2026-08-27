import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContextValue';
import { updateMe } from '../api/users'; // removed getUser (unused)

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatarUrl: '', smoking: '', drinking: '', sleepSchedule: '', occupation: '', location: '', budget: '', moveInDate: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        smoking: user.smoking || '', drinking: user.drinking || '', sleepSchedule: user.sleepSchedule || '',
        occupation: user.occupation || '', location: user.location || '', budget: user.budget || '', moveInDate: user.moveInDate || '',
      });
    }
  }, [user]);

  if (!user) return <div className="empty-page"><h2>Log in to view your profile.</h2></div>;

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
    <div className="profile-page">
      <div className="page-title"><span className="section-kicker">Your space</span><h1>Profile</h1><p>Tell the community a little about what makes a place feel like home.</p></div>

      {!editing ? (
        <div className="profile-card">
          <span className="avatar avatar-large">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="preference-list">{[user.smoking, user.drinking, user.sleepSchedule, user.occupation, user.location].filter(Boolean).map((item) => <span key={item}>{item}</span>)}</div>
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="profile-avatar"
            />
          )}
          <br />
          <button className="button button-secondary" onClick={() => setEditing(true)}>Edit profile</button>
        </div>
      ) : (
        <div className="profile-form">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label htmlFor="profile-bio">Bio</label>
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <label htmlFor="profile-avatar">Avatar URL</label>
          <input
            id="profile-avatar"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
          />
          <div className="form-grid">
            <div><label htmlFor="profile-smoking">Smoking</label><input id="profile-smoking" value={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.value })} /></div>
            <div><label htmlFor="profile-drinking">Drinking</label><input id="profile-drinking" value={form.drinking} onChange={(e) => setForm({ ...form, drinking: e.target.value })} /></div>
            <div><label htmlFor="profile-sleep">Daily rhythm</label><input id="profile-sleep" value={form.sleepSchedule} onChange={(e) => setForm({ ...form, sleepSchedule: e.target.value })} /></div>
            <div><label htmlFor="profile-budget">Monthly budget</label><input id="profile-budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
          </div>
          <label htmlFor="profile-occupation">Occupation</label><input id="profile-occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
          <label htmlFor="profile-location">Preferred location</label><input id="profile-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <label htmlFor="profile-move-in">Move-in timing</label><input id="profile-move-in" type="date" value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} />
          <div className="form-actions">
            <button className="button button-primary" onClick={save}>Save changes</button>
            <button className="button button-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
