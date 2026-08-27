export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-meta">
        <span className="avatar avatar-small">{(post.authorName || "A").charAt(0).toUpperCase()}</span>
        <div><h4>{post.authorName || "Anonymous"}</h4><span className="post-label">Roomie community</span></div>
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="Post" />}
    </div>
  );
}
