import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostDetail from "../components/PostDetail";
import Comments from "../components/Comments";
import { dummyPosts, dummyUser } from "../assets/dummyData";

function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(
    dummyPosts.find((p) => p.id === Number(id)) || dummyPosts[0],
  );

  useEffect(() => {
    const found = dummyPosts.find((p) => p.id === Number(id)) || dummyPosts[0];
    setPost(found);
  }, [id]);

  function handleUpdate(updatedFields) {
    setPost((prev) => ({ ...prev, ...updatedFields }));
  }

  function handleAddComment(text) {
    const newComment = {
      id: Date.now(),
      username: dummyUser.username,
      text,
      createdAt: new Date().toISOString(),
    };
    setPost((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
  }

  function handleDelete() {
    alert(`Post "${post.bookTitle}" would be deleted here (no backend yet).`);
  }

  return (
    <div>
      <PostDetail
        post={post}
        isOwner={post.username === dummyUser.username}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <Comments comments={post.comments} onAddComment={handleAddComment} />
    </div>
  );
}

export default Post;
