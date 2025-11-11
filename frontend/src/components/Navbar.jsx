import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>FindMyRoomie</h2>
      <div>
        <Link to="/">Home</Link>
        {user && <Link to="/chat">Chat</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
