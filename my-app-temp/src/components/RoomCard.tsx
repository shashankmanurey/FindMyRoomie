import React from "react";
import { Link } from "react-router-dom";

export interface Room {
  id?: number;
  title:string; desc:string; price:string; area:string; image?:string; userId?: number;
}

const RoomCard: React.FC<{room:Room; canEdit?:boolean; onDelete?:()=>void}> = ({room, canEdit, onDelete})=>{
  return (
    <div className="card" style={{padding:12}}>
      <img src={room.image || "https://source.unsplash.com/800x600/?room"} style={{width:"100%",height:160,objectFit:"cover",borderRadius:8}}/>
      <h3 style={{margin:"8px 0"}}>{room.title}</h3>
      <p style={{color:"#6b7280"}}>{room.desc}</p>
      <div style={{marginTop:8,fontWeight:600}}>{room.price} • {room.area}</div>
      <div style={{marginTop:10,display:"flex",gap:8}}>
        <Link to={`/posts/${room.id}`}><button style={{padding:"6px 10px",borderRadius:6}}>View Details</button></Link>
        {canEdit && <button onClick={onDelete} style={{padding:"6px 10px",borderRadius:6,background:"#ef4444",color:"#fff"}}>Delete</button>}
      </div>
    </div>
  );
};

export default RoomCard;
