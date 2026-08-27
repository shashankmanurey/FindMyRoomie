import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "", smoking: "", drinking: "", sleepSchedule: "", occupation: "", location: "", budget: "", moveInDate: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register(form);
      if (res.status === 200) {
        alert("Registration successful. Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <span className="section-kicker">A better kind of search</span>
      <h1>Find your people.</h1>
      <p className="form-intro">Tell us a little about your lifestyle so better matches can find you.</p>

      <label htmlFor="register-name">Your name</label>
      <input
        id="register-name"
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <label htmlFor="register-email">Email address</label>
      <input
        id="register-email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <label htmlFor="register-bio">About you</label>
      <textarea id="register-bio" placeholder="A few words about your lifestyle..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      <div className="form-grid">
        <div><label htmlFor="register-smoking">Smoking</label><select id="register-smoking" value={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.value })}><option value="">Choose</option><option>Non-smoker</option><option>Smoker</option><option>Outside only</option></select></div>
        <div><label htmlFor="register-drinking">Drinking</label><select id="register-drinking" value={form.drinking} onChange={(e) => setForm({ ...form, drinking: e.target.value })}><option value="">Choose</option><option>Never</option><option>Sometimes</option><option>Often</option></select></div>
        <div><label htmlFor="register-sleep">Daily rhythm</label><select id="register-sleep" value={form.sleepSchedule} onChange={(e) => setForm({ ...form, sleepSchedule: e.target.value })}><option value="">Choose</option><option>Morning person</option><option>Night owl</option><option>Flexible</option></select></div>
        <div><label htmlFor="register-budget">Monthly budget</label><input id="register-budget" type="number" min="0" placeholder="₹ budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
      </div>
      <label htmlFor="register-occupation">Occupation</label>
      <input id="register-occupation" placeholder="Student, designer, engineer..." value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
      <label htmlFor="register-location">Preferred location</label>
      <input id="register-location" placeholder="City or neighborhood" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <label htmlFor="register-move-in">Move-in timing</label>
      <input id="register-move-in" type="date" value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} />

      {error && <p className="form-error">{error}</p>}

      <button className="button button-primary" type="submit">Create account</button>

      <p className="form-footer">
        Already have an account?{" "}
        <a href="/login">Log in</a>
      </p>
    </form>
  );
}
