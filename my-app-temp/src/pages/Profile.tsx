import React, { useState, useEffect } from "react";
import type { User } from "../App";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile: React.FC<{ user: User | null; setUser: (u:User|null)=>void }> = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const nav = useNavigate();

  useEffect(()=>{ if(user){ setName(user.name); setLocation(user.location||""); } }, [user]);

  if(!user) return <div style={{maxWidth:420, margin:"40px auto"}} className="card">Please login.</div>;

  const save = async () => {
    try{
      const res = await api.put(`/api/users/${user.id}`, { name, location, profileImage });
      setUser(res.data);
      nav("/");
    }catch(e:any){ alert("Save failed: " + (e?.response?.data || e.message)); }
  };

  return (
    <div style={{maxWidth:720, margin:"40px auto"}}>
      <div className="card">
        <h2>Edit Profile</h2>
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Profile image URL" value={profileImage} onChange={e=>setProfileImage(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <div style={{marginTop:12}}>
          <button onClick={save} style={{padding:"8px 12px",background:"#4f46e5",color:"white",borderRadius:6}}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
