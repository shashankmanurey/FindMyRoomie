import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";

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
      <Link className="brand" to="/">
        <span className="brand-mark">F</span>
        <span>FindMyRoomie</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Discover</Link>
        {user && <Link to="/chat">Messages</Link>}
        {user && <Link to="/profile">My profile</Link>}
        {!user && <Link className="nav-quiet" to="/login">Log in</Link>}
        {!user && <Link className="nav-cta" to="/register">Get started</Link>}
        {user && <button className="nav-quiet" onClick={handleLogout}>Log out</button>}
      </div>
    </nav>
  );
}
