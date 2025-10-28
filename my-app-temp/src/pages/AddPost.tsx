import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import type { User } from "../App";

const AddPost: React.FC<{ user: User | null }> = ({ user }) => {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState("");

  if(!user) return <div style={{maxWidth:420, margin:"40px auto"}} className="card">Please login to add a post.</div>;

  const submit = async ()=>{
    try{
      await api.post("/api/rooms", { title, desc, price, area, image, userId: user.id });
      nav("/");
    }catch(e:any){ alert("Failed: "+(e?.response?.data||e.message)); }
  };

  return (
    <div style={{maxWidth:720, margin:"40px auto"}}>
      <div className="card">
        <h2>Add Room Post</h2>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Area / Location" value={area} onChange={e=>setArea(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Image URL (optional)" value={image} onChange={e=>setImage(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <div style={{marginTop:12}}>
          <button onClick={submit} style={{padding:"8px 12px",background:"#4f46e5",color:"white",borderRadius:6}}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
