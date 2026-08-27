import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();
  const preferences = [post.smoking, post.drinking, post.sleepSchedule, post.occupation, post.location].filter(Boolean);
  return (
    <article className="post-card" onClick={() => setOpen(true)}>
      <div className="post-meta">
        <span className="avatar avatar-small">{(post.authorName || "A").charAt(0).toUpperCase()}</span>
        <div><h4>{post.authorName || "Anonymous"}</h4><span className="post-label">Roomie community</span></div>
      </div>
      {post.imageUrls?.[0] && <div className="post-cover"><img className="post-image" src={post.imageUrls[0]} alt={`Room shared by ${post.authorName || "a roomie"}`} /><span>{post.imageUrls.length} photos</span></div>}
      {open && <div className="post-detail" role="dialog" aria-modal="true" onClick={(event) => { event.stopPropagation(); setOpen(false); }}>
        <div className="post-detail-content" onClick={(event) => event.stopPropagation()}>
          <button className="close-button" onClick={() => setOpen(false)} aria-label="Close post">×</button>
          <div className="gallery"><img className="detail-image" src={post.imageUrls?.[activeImage]} alt={`Room shared by ${post.authorName || "a roomie"}`} /><div className="gallery-controls"><button disabled={activeImage === 0} onClick={() => setActiveImage(activeImage - 1)}>Previous</button><span>{activeImage + 1} / {post.imageUrls?.length || 0}</span><button disabled={activeImage === (post.imageUrls?.length || 1) - 1} onClick={() => setActiveImage(activeImage + 1)}>Next</button></div></div>
          {post.content && <p className="detail-description">{post.content}</p>}
          <div className="detail-profile"><span className="avatar avatar-large">{(post.authorName || "A").charAt(0).toUpperCase()}</span><h2>{post.authorName || "Anonymous"}</h2><span className="post-label">Looking for a compatible roomie</span>{post.bio && <p>{post.bio}</p>}<div className="preference-list">{preferences.map((item) => <span key={item}>{item}</span>)}</div><button className="button button-primary contact-button" onClick={() => navigate('/chat', { state: { recipient: { id: post.authorId, name: post.authorName, email: post.authorEmail } } })}>Contact {post.authorName || 'roomie'}</button></div>
        </div>
      </div>}
    </article>
  );
}
