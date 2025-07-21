import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdChevronLeft,
  MdChevronRight,
  MdSend,
  MdLocationOn,
  MdShare,
  MdFlag
} from "react-icons/md";
import { supabase } from "../components/Auth/SupabaseClient";

const ForumDetailPage = () => {
  
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("Artikel").select("*, Profile(*)").eq("id", postId).single();
      if (error) {
        console.error("Error fetching forum data:", error);
      } else {
        console.log("Fetched forum data:", data);
        setPost(data);
      }
    }
    fetchData();
  }, []);

  const { id } = useParams();
  const postId = parseInt(id);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Budagent15",
      timeAgo: "3 hrs",
      content: "Kasihan banget tukang baksonya, semoga cepat sembuh...",
      upvotes: 14,
      downvotes: 0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40",
      userVote: null,
      replies: [],
    },
    {
      id: 2,
      username: "Tung.central18",
      timeAgo: "1 hr",
      content: "Iya emak kasihan, tukang jual nasi juga melihat",
      upvotes: 0,
      downvotes: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40",
      userVote: null,
      replies: [],
    },
  ]);

  const [showAllComments, setShowAllComments] = useState(false);
  const commentsToShow = showAllComments ? comments : comments.slice(0, 2);

  if (!post) {
    return <div className="p-8 text-center text-red-600">Post not found.</div>;
  }

  const handlePostVote = (type) => {
    setPost(prevPost => {
      const updatedPost = { ...prevPost };
      if (updatedPost.userVote === "up") updatedPost.upvotes--;
      if (updatedPost.userVote === "down") updatedPost.downvotes--;

      if (updatedPost.userVote !== type) {
        if (type === "up") updatedPost.upvotes++;
        else updatedPost.downvotes++;
        updatedPost.userVote = type;
      } else {
        updatedPost.userVote = null;
      }
      return updatedPost;
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        username: "Test2",
        timeAgo: "now",
        content: newComment,
        upvotes: 0,
        downvotes: 0,
        avatar: "https://placehold.co/200x200/000000/000000.png",
        userVote: null,
        replies: [],
      },
    ]);
    setNewComment("");
  };

  const handleVote = (id, type, isReply = false, parentId) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (!isReply && comment.id === id) {
          const updated = { ...comment };
          if (updated.userVote === "up") updated.upvotes--;
          if (updated.userVote === "down") updated.downvotes--;
          if (updated.userVote !== type) {
            if (type === "up") updated.upvotes++;
            else updated.downvotes++;
            updated.userVote = type;
          } else {
            updated.userVote = null;
          }
          return updated;
        }

        if (isReply && comment.id === parentId) {
          const replies = comment.replies.map((r) => {
            if (r.id === id) {
              const updated = { ...r };
              if (updated.userVote === "up") updated.upvotes--;
              if (updated.userVote === "down") updated.downvotes--;
              if (updated.userVote !== type) {
                if (type === "up") updated.upvotes++;
                else updated.downvotes++;
                updated.userVote = type;
              } else {
                updated.userVote = null;
              }
              return updated;
            }
            return r;
          });
          return { ...comment, replies };
        }

        return comment;
      })
    );
  };

  const handleAddReplyToComment = (parentId, replyContent) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: Date.now(),
                  username: "Test2",
                  timeAgo: "now",
                  content: replyContent,
                  upvotes: 0,
                  downvotes: 0,
                  avatar: "https://placehold.co/200x200/000000/000000.png",
                  userVote: null,
                },
              ],
            }
          : comment
      )
    );
  };

  const CommentComponent = ({ comment, isReply = false, parentId }) => {
    const [replyingToThisComment, setReplyingToThisComment] = useState(false);
    const [currentReplyText, setCurrentReplyText] = useState("");

    const handleReplySubmit = () => {
      if (!currentReplyText.trim()) return;
      handleAddReplyToComment(comment.id, currentReplyText);
      setCurrentReplyText("");
      setReplyingToThisComment(false);
    };

    return (
      <div className={`flex gap-3 ${isReply ? "ml-8 mt-3" : ""}`}>
        <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex gap-2 text-sm text-gray-700">
            <span className="font-semibold">{comment.username}</span>
            <span className="text-xs text-gray-400">{comment.timeAgo}</span>
          </div>
          <p className="text-sm my-2">{comment.content}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span
              className={`cursor-pointer ${comment.userVote === "up" ? "text-green-500" : ""}`}
              onClick={() => handleVote(comment.id, "up", isReply, parentId)}
            >
              <MdKeyboardArrowUp />
            </span>
            <span>{comment.upvotes}</span>
            <span
              className={`cursor-pointer ${comment.userVote === "down" ? "text-red-500" : ""}`}
              onClick={() => handleVote(comment.id, "down", isReply, parentId)}
            >
              <MdKeyboardArrowDown />
            </span>
            <span>{comment.downvotes}</span>
            {!isReply && (
              <button
                onClick={() => setReplyingToThisComment(!replyingToThisComment)}
                className="text-blue-500 hover:underline"
              >
                Reply
              </button>
            )}
          </div>

          {!isReply && replyingToThisComment && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                className="border px-2 py-1 rounded w-full"
                value={currentReplyText}
                onChange={(e) => setCurrentReplyText(e.target.value)}
                placeholder="Write reply..."
              />
              <button onClick={handleReplySubmit} className="bg-blue-500 text-white px-2 py-1 rounded">
                <MdSend />
              </button>
            </div>
          )}

          {!isReply &&
            comment.replies?.map((reply) => (
              <CommentComponent key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4 md:mx-24 bg-white min-h-screen">
      <div className="p-4 bg-gray-100 text-sm text-gray-600">
        <span onClick={() => navigate(-1)} className="cursor-pointer text-blue-600 hover:underline">
          Forum Highlights
        </span>{" "}
        &gt; {post.judul}
      </div>

      <div className="p-6">
        <div className="text-gray-600 flex items-center gap-2 mb-2">
          <MdLocationOn />
          <span>{post.tag} - {post.subCategory}</span>
          <span className="mx-1">•</span>
          <span>{post.lokasi}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.judul}</h1>

        {/* --- Dynamic Profile Section --- */}
        <div className="flex items-center gap-2 mb-4">
          {post.Profile.foto && ( // Conditionally render avatar if it exists
            <img
              src={post.Profile.foto}
              alt={`${post.Profile.username}'s Avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          {post.username && ( // Conditionally render username if it exists
            <span className="font-semibold text-gray-800">{post.username}</span>
          )}
        </div>
        {/* --- End Dynamic Profile Section --- */}

        {post.foto && <img src={post.foto} alt={post.judul} className="w-full aspect-video object-cover rounded mb-6" />}

        <p className="text-gray-700">{post.isi}</p>

        <div className="flex gap-6 mt-6 text-gray-600">
          <div className="flex gap-1 items-center">
            <MdKeyboardArrowUp
              className={`cursor-pointer ${post.userVote === "up" ? "text-green-500" : ""}`}
              onClick={() => handlePostVote("up")}
            />
            {post.upvotes}
          </div>
          <div className="flex gap-1 items-center">
            <MdKeyboardArrowDown
              className={`cursor-pointer ${post.userVote === "down" ? "text-red-500" : ""}`}
              onClick={() => handlePostVote("down")}
            />
            {post.downvotes}
          </div>
          <div className="flex gap-1 items-center">
            <MdShare /> {post.comments}
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded">
            <MdSend />
          </button>
        </div>

        {commentsToShow.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            handleVote={handleVote}
            handleAddReplyToComment={handleAddReplyToComment}
          />
        ))}

        {comments.length > 2 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="mt-4 text-blue-600 hover:underline flex items-center"
          >
            Show More Comments <MdKeyboardArrowDown className="ml-1" />
          </button>
        )}
          {showAllComments && (
          <button
            onClick={() => setShowAllComments(false)}
            className="mt-4 text-blue-600 hover:underline flex items-center"
          >
            Show Less Comments <MdKeyboardArrowUp className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ForumDetailPage;