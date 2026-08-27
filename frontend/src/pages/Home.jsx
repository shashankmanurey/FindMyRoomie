import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { getPosts, createPost } from "../api/posts";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/authContextValue";
import MatchList from "../components/MatchList";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(AuthContext);
  const loaderRef = useRef(null);

  const load = useCallback((page = 0) => {
    if (page === 0) setLoading(true); else setLoadingMore(true);
    getPosts(page).then(res => {
      const nextPosts = res.data.content || [];
      setPosts((current) => page === 0 ? nextPosts : [...current, ...nextPosts]);
      setHasMore(!res.data.last);
    }).catch(console.error).finally(() => { setLoading(false); setLoadingMore(false); });
  }, []);

  useEffect(() => {
    setPosts([]);
    load(0);
  }, [load, user?.location]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) load(Math.floor(posts.length / 10));
    }, { rootMargin: '240px' });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, load, posts.length]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please log in to create posts'); return; }
    try {
      if (images.length < 3 || images.length > 6) { alert('Please choose between 3 and 6 room photos'); return; }
      await createPost(content, images);
      setContent('');
      setImages([]);
      load(0);
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
          <p>Browse rooms and meet people who make a place feel like home.</p>
        </div>
        <div className="intro-stat"><strong>{posts.length}</strong><span>{user?.location ? `${user.location} posts` : 'community posts'}</span></div>
      </div>

      <div className="feed-location"><span className="location-pin">●</span><span>{user?.location ? `Showing rooms in ${user.location}` : 'Set your city in Profile to see nearby rooms'}</span></div>

      <div className="composer">
        <div className="composer-heading"><span className="avatar">{user ? (user.name || 'Y').charAt(0).toUpperCase() : '?'}</span><span>{user ? `What’s on your mind, ${user.name || 'roomie'}?` : 'Join the conversation'}</span></div>
        <form onSubmit={submit}>
          <textarea
            placeholder="Share something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <label className="photo-picker" htmlFor="room-photo"><span className="photo-icon">+</span><span>{images.length ? `${images.length} photos selected` : 'Add 3–6 photos of your room'}</span><small>JPG, PNG or WEBP · up to 10 MB each</small></label>
          <input id="room-photo" className="file-input" type="file" accept="image/jpeg,image/png,image/webp" required multiple onChange={(e) => setImages(Array.from(e.target.files).slice(0, 6))} />
          {images.length > 0 && <div className="photo-preview-grid">{images.map((photo) => <img key={`${photo.name}-${photo.lastModified}`} src={URL.createObjectURL(photo)} alt="Selected room" />)}</div>}
          <button className="button button-primary" type="submit">Share with the community</button>
        </form>
      </div>

      <MatchList />

      <div className="posts-container">
        {loading && <div className="empty-state">Loading the community board...</div>}
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
        {!loading && !posts.length && <div className="empty-state">No posts yet. Be the first to say hello.</div>}
        <div ref={loaderRef} className="feed-loader">{loadingMore ? 'Finding more rooms...' : hasMore ? '' : 'You’ve reached the end of the feed.'}</div>
      </div>
    </div>
  );
}
