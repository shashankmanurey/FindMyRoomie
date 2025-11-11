export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <h4>{post.authorName || "Anonymous"}</h4>
      <p>{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
    </div>
  );
}
