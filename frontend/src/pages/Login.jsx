import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { AuthContext } from "../context/authContextValue";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userId", res.data.user.id);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <span className="section-kicker">Welcome back</span>
      <h1>Make yourself at home.</h1>
      <p className="form-intro">Log in to find people, share updates, and keep the conversation going.</p>

      <label htmlFor="login-email">Email address</label>
      <input
        id="login-email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="button button-primary" type="submit">Log in</button>

      <p className="form-footer">
        Don’t have an account?{" "}
        <Link to="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
}
