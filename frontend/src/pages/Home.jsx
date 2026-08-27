import { useEffect, useState, useContext } from "react";
import { getPosts, createPost } from "../api/posts";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/authContextValue";
import MatchList from "../components/MatchList";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const load = () => {
    setLoading(true);
    getPosts().then(res => setPosts(res.data.content || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please log in to create posts'); return; }
    try {
      await createPost(content, imageUrl || null);
      setContent('');
      setImageUrl('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  return (
    <div className="home">
      <div className="page-intro">
        <div>
          <span className="section-kicker">The roomie board</span>
          <h1>Find your next <em>good fit.</em></h1>
          <p>Share what you’re looking for, swap advice, and meet people who make a place feel like home.</p>
        </div>
        <div className="intro-stat"><strong>{posts.length}</strong><span>community posts</span></div>
      </div>

      <div className="composer">
        <div className="composer-heading"><span className="avatar">{user ? (user.name || 'Y').charAt(0).toUpperCase() : '?'}</span><span>{user ? `What’s on your mind, ${user.name || 'roomie'}?` : 'Join the conversation'}</span></div>
        <form onSubmit={submit}>
          <textarea
            placeholder="Share something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <input className="photo-input" type="url" placeholder="Add a room photo URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button className="button button-primary" type="submit">Share with the community</button>
        </form>
      </div>

      <MatchList />

      <div className="posts-container">
        {loading && <div className="empty-state">Loading the community board...</div>}
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
        {!loading && !posts.length && <div className="empty-state">No posts yet. Be the first to say hello.</div>}
      </div>
    </div>
  );
}
