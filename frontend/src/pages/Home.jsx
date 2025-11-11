import { useEffect, useState, useContext } from "react";
import { getPosts, createPost } from "../api/posts";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const load = () => {
    getPosts().then(res => setPosts(res.data.content)).catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please login to create posts'); return; }
    try {
      await createPost(content, null);
      setContent('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  return (
    <div className="home">
      <h2>Posts</h2>

      <div style={{marginBottom: 16, background: '#fff', padding: 12, borderRadius: 6}}>
        <form onSubmit={submit}>
          <textarea
            placeholder="Share something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{width: '100%', marginBottom: 8}}
          />
          <button type="submit">Create Post</button>
        </form>
      </div>

      <div className="posts-container">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
