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
  MdFlag,
} from "react-icons/md";
import { supabase } from "../components/Auth/SupabaseClient";

const ForumDetailPage = () => {
  const [comments, setComments] = useState(null);
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id);
  
  // Fetch post data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Artikel")
          .select("*, Profile(*)")
          .eq("id", postId)
          .single();
        
        if (error) {
          console.error("Error fetching forum data:", error);
          setError("Failed to load post");
        } else {
          setPost(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    if (postId) {
      fetchData();
    }
  }, [postId]);

  // Fetch comments data
  useEffect(() => {
    const fetchKomentar = async () => {
      if (!postId) return;
      
      try {
        const { data, error } = await supabase
          .from("Komentar")
          .select("*, Profile(*)")
          .eq("artikel_id", postId)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching comments:", error);
      }
    };
    
    fetchKomentar();
  }, [postId]);

  const categories = [
    {
      name: "Berita Lokal",
      subcategories: [
        "Baru saja",
        "Kriminalitas",
        "Kondisi Sektiar",
        "Bencana",
        "Lalu lintas",
      ],
    },
    {
      name: "Opini & Diskusi",
      subcategories: ["Suara Rakyat", "Rekomendasi", "Setuju gak?"],
    },
    {
      name: "Layanan Publik",
      subcategories: ["Fasilitas umum", "Kebijakan lokal", "Bencana"],
    },
    {
      name: "Masyarakat",
      subcategories: ["Sosial & event", "Lingkungan", "Hewan hilang"],
    },
  ];

  const subCategoryToParent = {};
  categories.forEach((category) => {
    category.subcategories.forEach((sub) => {
      subCategoryToParent[sub.toLowerCase()] = category.name;
    });
  });

  const category =
    post?.tag && subCategoryToParent[post.tag.toLowerCase()]
      ? subCategoryToParent[post.tag.toLowerCase()]
      : null;

  const commentsToShow = showAllComments ? comments : comments?.slice(0, 2);

  const handlePostVote = async (type) => {
    // This would typically update the database as well
    setPost((prevPost) => {
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      
      if (!user) {
        alert("You must be logged in to comment");
        return;
      }
      
      const { error } = await supabase.from("Komentar").insert({
        isi_komentar: newComment,
        artikel_id: postId,
        id_user: user.id,
      });
      
      if (error) {
        throw error;
      } else {
        // Refresh comments after adding
        const { data: updatedComments } = await supabase
          .from("Komentar")
          .select("*, Profile(*)")
          .eq("artikel_id", postId)
          .order("created_at", { ascending: false });
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
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
      <div className={`flex gap-3 ${isReply ? "ml-8 mt-3" : "mb-4"}`}>
        <img
          src={comment.Profile?.foto || comment.avatar || "https://placehold.co/40x40/cccccc/000000.png"}
          alt={comment.Profile?.username || comment.username || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex gap-2 text-sm text-gray-700">
            <span className="font-semibold">
              {comment.Profile?.username || comment.username || "Anonymous"}
            </span>
            <span className="text-xs text-gray-400">
              {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : comment.timeAgo}
            </span>
          </div>
          <p className="text-sm my-2">
            {comment.isi_komentar || comment.content}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span
              className={`cursor-pointer ${
                comment.userVote === "up" ? "text-green-500" : ""
              }`}
              onClick={() => handleVote(comment.id, "up", isReply, parentId)}
            >
              <MdKeyboardArrowUp />
            </span>
            <span>{comment.upvotes || 0}</span>
            <span
              className={`cursor-pointer ${
                comment.userVote === "down" ? "text-red-500" : ""
              }`}
              onClick={() => handleVote(comment.id, "down", isReply, parentId)}
            >
              <MdKeyboardArrowDown />
            </span>
            <span>{comment.downvotes || 0}</span>
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
              <button
                onClick={handleReplySubmit}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                <MdSend />
              </button>
            </div>
          )}

          {!isReply &&
            comment.replies?.map((reply) => (
              <CommentComponent
                key={reply.id}
                comment={reply}
                isReply={true}
                parentId={comment.id}
              />
            ))}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-4 md:mx-24 bg-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-4 md:mx-24 bg-white min-h-screen">
        <div className="p-8 text-center">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="mx-4 md:mx-24 bg-white min-h-screen">
        <div className="p-8 text-center text-red-600">
          <p>Post not found.</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-24 bg-white min-h-screen">
      <div className="p-4 bg-gray-100 text-sm text-gray-600">
        <span
          onClick={() => navigate(-1)}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Forum Highlights
        </span>{" "}
        &gt; {post.judul}
      </div>

      <div className="p-6">
        <div className="text-gray-600 flex items-center gap-2 mb-2">
          <MdLocationOn />
          <span>
            {category} - {post.tag}
          </span>
          <span className="mx-1">•</span>
          <span>{post.lokasi}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.judul}</h1>

        {/* Dynamic Profile Section */}
        <div className="flex items-center gap-2 mb-4">
          {post.Profile?.foto && (
            <img
              src={post.Profile.foto}
              alt={`${post.Profile.username || 'User'}'s Avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          {post.Profile?.username && (
            <span className="font-semibold text-gray-800">
              {post.Profile.username}
            </span>
          )}
          {post.created_at && (
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {post.foto && (
          <img
            src={post.foto}
            alt={post.judul}
            className="w-full aspect-video object-cover rounded mb-6"
          />
        )}

        <p className="text-gray-700 whitespace-pre-wrap">{post.isi}</p>

        <div className="flex gap-6 mt-6 text-gray-600">
          <div className="flex gap-1 items-center">
            <MdKeyboardArrowUp
              className={`cursor-pointer ${
                post.userVote === "up" ? "text-green-500" : ""
              }`}
              onClick={() => handlePostVote("up")}
            />
            {post.upvotes || 0}
          </div>
          <div className="flex gap-1 items-center">
            <MdKeyboardArrowDown
              className={`cursor-pointer ${
                post.userVote === "down" ? "text-red-500" : ""
              }`}
              onClick={() => handlePostVote("down")}
            />
            {post.downvotes || 0}
          </div>
          <div className="flex gap-1 items-center">
            <MdShare /> {comments?.length || 0}
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <MdSend />
          </button>
        </div>

        {commentsToShow &&
          commentsToShow.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
            />
          ))}

        {comments && comments.length > 2 && !showAllComments && (
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
