import { useContext, useEffect, useState } from 'react';
import { getAllUsers } from '../api/users';
import { AuthContext } from '../context/authContextValue';

const preferenceFields = ['smoking', 'drinking', 'sleepSchedule', 'occupation', 'location'];

function compatibility(user, candidate) {
  const filled = preferenceFields.filter((field) => user?.[field]);
  if (!filled.length) return 0;
  return Math.round((filled.filter((field) => user[field] === candidate[field]).length / filled.length) * 100);
}

export default function MatchList() {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!user) return;
    getAllUsers().then((res) => setMatches(res.data.filter((candidate) => candidate.id !== user.id).slice(0, 6))).catch(() => setMatches([]));
  }, [user]);

  if (!user || !matches.length) return null;

  return (
    <section className="matches-section">
      <div className="section-heading"><div><span className="section-kicker">Made for your lifestyle</span><h2>Potential good fits</h2></div><span className="muted">Based on your preferences</span></div>
      <div className="match-grid">
        {matches.map((candidate) => {
          const score = compatibility(user, candidate);
          return <article className="match-card" key={candidate.id}>
            <span className="avatar avatar-large">{(candidate.name || 'U').charAt(0).toUpperCase()}</span>
            <h3>{candidate.name}</h3>
            <p className="muted">{candidate.occupation || 'Roomie seeker'}{candidate.location ? ` · ${candidate.location}` : ''}</p>
            <div className="match-score"><strong>{score}%</strong><span>lifestyle match</span></div>
            <div className="preference-list">{[candidate.smoking, candidate.drinking, candidate.sleepSchedule].filter(Boolean).map((item) => <span key={item}>{item}</span>)}</div>
          </article>;
        })}
      </div>
    </section>
  );
}
