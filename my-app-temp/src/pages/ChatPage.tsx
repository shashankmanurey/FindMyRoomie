import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import type { User } from "../App";

const ChatPage: React.FC<{ user: User | null }> = ({ user }) => {
  const { userId } = useParams(); // other user's id
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(()=> {
    if(!user || !userId) return;
    fetchMessages();
    const iv = setInterval(fetchMessages, 2000); // simple poll
    return ()=>clearInterval(iv);
  }, [user, userId]);

  const fetchMessages = async () => {
    try{
      const res = await api.get(`/api/messages/conversation?a=${user?.id}&b=${userId}`);
      setMessages(res.data);
    }catch(e){ /* ignore */ }
  };

  const send = async () => {
    if(!user || !userId) return;
    try{
      await api.post(`/api/messages`, { sender: user.id, receiver: parseInt(userId), content: text });
      setText("");
      fetchMessages();
    }catch(e:any){ alert("Failed to send: "+(e?.response?.data||e.message)); }
  };

  if(!user) return <div style={{maxWidth:720, margin:"40px auto"}} className="card">Please login to chat.</div>;

  return (
    <div style={{maxWidth:720, margin:"40px auto"}}>
      <div className="card" style={{display:"flex", flexDirection:"column", height:560}}>
        <div style={{flex:1, overflowY:"auto", paddingRight:8}}>
          {messages.map(m=>(
            <div key={m.id} style={{display:"flex", justifyContent: m.sender.id===user.id ? "flex-end":"flex-start", marginBottom:8}}>
              <div style={{background: m.sender.id===user.id ? "#4f46e5":"#e5e7eb", color: m.sender.id===user.id ? "white":"black", padding:8, borderRadius:8, maxWidth:"70%"}}>
                <div style={{fontSize:13, color:m.sender.id===user.id ? "rgba(255,255,255,0.9)":"#374151"}}>{m.content}</div>
                <div style={{fontSize:11, marginTop:6, opacity:0.7}}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex", gap:8, marginTop:12}}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" style={{flex:1,padding:8,borderRadius:8,border:"1px solid #e5e7eb"}} />
          <button onClick={send} style={{padding:"8px 12px",background:"#4f46e5",color:"white",borderRadius:8}}>Send</button>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
