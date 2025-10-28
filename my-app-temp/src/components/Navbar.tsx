import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../App";

const Navbar: React.FC<{ user: User | null; setUser: (u: User | null)=>void }> = ({ user, setUser })=>{
  const navigate = useNavigate();
  const logout = () => {
    // simple client logout
    setUser(null);
    navigate("/");
  };
  return (
    <div style={{background:"#fff", borderBottom:"1px solid #e5e7eb"}}>
      <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div style={{fontWeight:700, color:"#4f46e5"}}><Link to="/">FindMyRoomie</Link></div>
        <div style={{flex:1, marginLeft:20, marginRight:20}}>
          <input placeholder="Search by area or title" style={{width:"100%", padding:10, borderRadius:8, border:"1px solid #e5e7eb"}} />
        </div>
        <div style={{display:"flex", gap:10}}>
          {!user ? <>
            <button onClick={()=>navigate("/login")} style={{background:"none", border:"none", color:"#4f46e5"}}>Login</button>
            <button onClick={()=>navigate("/signup")} style={{background:"#4f46e5", color:"white", padding:"8px 12px", borderRadius:8}}>Signup</button>
          </> : <>
            <div style={{display:"flex", alignItems:"center", gap:10, cursor:"pointer"}} onClick={()=>navigate("/profile")}>
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" style={{width:36,height:36,borderRadius:999}} />
              <div>{user.name}</div>
            </div>
            <button onClick={logout} style={{background:"#ef4444", color:"white", padding:"8px 12px", borderRadius:8}}>Logout</button>
          </>}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
