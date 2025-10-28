import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login: React.FC<{setUser:(u:any)=>void}> = ({setUser})=>{
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const nav = useNavigate();

  const submit = async () => {
    try{
      const res = await api.post("/api/auth/login",{email,password});
      setUser(res.data);
      nav("/");
    }catch(e){ alert("Invalid credentials"); }
  };

  return (
    <div style={{maxWidth:420, margin:"40px auto"}}>
      <div className="card">
        <h2>Login</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:8,marginTop:8}} />
        <div style={{marginTop:12,display:"flex",gap:8}}>
          <button onClick={submit} style={{padding:"8px 12px",background:"#4f46e5",color:"white",borderRadius:6}}>Login</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
