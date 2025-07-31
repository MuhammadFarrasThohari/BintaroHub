import React, { useEffect, useState, useCallback } from "react";
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
  
  // Function to refresh comments with vote counts
  const refreshComments = useCallback(async () => {
    if (!postId) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      
      const { data, error } = await supabase
        .from("Komentar")
        .select(`
          *,
          Profile(*),
          like_komentar(id, user_id),
          dislike_komentar(id, user_id)
        `)
        .eq("artikel_id", postId)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }
      
      // Process comments with vote counts and user vote status
      const processedComments = data?.map(comment => ({
        ...comment,
        upvotes: comment.like_komentar?.length || 0,
        downvotes: comment.dislike_komentar?.length || 0,
        userVote: user ? (
          comment.like_komentar?.some(like => like.user_id === user.id) ? 'up' :
          comment.dislike_komentar?.some(dislike => dislike.user_id === user.id) ? 'down' :
          null
        ) : null
      })) || [];
      
      // Group comments with their replies
      const groupedComments = processedComments.reduce((acc, comment) => {
        if (!comment.parent_id) {
          // This is a top-level comment
          acc.push({
            ...comment,
            replies: processedComments.filter(reply => 
              reply.parent_id === comment.id
            ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          });
        }
        return acc;
      }, []);
      
      setComments(groupedComments);
    } catch (error) {
      console.error("Unexpected error fetching comments:", error);
    }
  }, [postId]);
  
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
    refreshComments();
  }, [refreshComments]);

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
        await refreshComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
    setNewComment("");
  };

  const handleVote = async (commentId, type) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      
      if (!user) {
        alert("You must be logged in to vote");
        return;
      }
      
      // Check if user has already voted on this comment
      const [likeResult, dislikeResult] = await Promise.all([
        supabase
          .from("like_komentar")
          .select("id")
          .eq("comment_id", commentId)
          .eq("user_id", user.id)
          .maybeSingle(), // Use maybeSingle instead of single to avoid errors when no data found
        supabase
          .from("dislike_komentar")
          .select("id")
          .eq("comment_id", commentId)
          .eq("user_id", user.id)
          .maybeSingle() // Use maybeSingle instead of single to avoid errors when no data found
      ]);
      
      if (likeResult.error && likeResult.error.code !== 'PGRST116') {
        console.error("Error checking likes:", likeResult.error);
        throw likeResult.error;
      }
      
      if (dislikeResult.error && dislikeResult.error.code !== 'PGRST116') {
        console.error("Error checking dislikes:", dislikeResult.error);
        throw dislikeResult.error;
      }
      
      const hasLiked = likeResult.data !== null;
      const hasDisliked = dislikeResult.data !== null;
      
      // Handle vote logic with mutual exclusivity
      if (type === "up") {
        if (hasLiked) {
          // Remove like (toggle off)
          const { error } = await supabase
            .from("like_komentar")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user.id);
          
          if (error) {
            console.error("Error removing like:", error);
            throw error;
          }
        } else {
          // Remove any existing dislike first (mutual exclusivity)
          if (hasDisliked) {
            const { error: removeDislikeError } = await supabase
              .from("dislike_komentar")
              .delete()
              .eq("comment_id", commentId)
              .eq("user_id", user.id);
            
            if (removeDislikeError) {
              console.error("Error removing existing dislike:", removeDislikeError);
              throw removeDislikeError;
            }
          }
          
          // Add like
          const { error: insertError } = await supabase
            .from("like_komentar")
            .insert({
              comment_id: commentId,
              user_id: user.id
            });
            
          if (insertError) {
            console.error("Error adding like:", insertError);
            throw insertError;
          }
        }
      } else if (type === "down") {
        if (hasDisliked) {
          // Remove dislike (toggle off)
          const { error } = await supabase
            .from("dislike_komentar")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user.id);
            
          if (error) {
            console.error("Error removing dislike:", error);
            throw error;
          }
        } else {
          // Remove any existing like first (mutual exclusivity)
          if (hasLiked) {
            const { error: removeLikeError } = await supabase
              .from("like_komentar")
              .delete()
              .eq("comment_id", commentId)
              .eq("user_id", user.id);
            
            if (removeLikeError) {
              console.error("Error removing existing like:", removeLikeError);
              throw removeLikeError;
            }
          }
          
          // Add dislike
          const { error: insertError } = await supabase
            .from("dislike_komentar")
            .insert({
              comment_id: commentId,
              user_id: user.id
            });
            
          if (insertError) {
            console.error("Error adding dislike:", insertError);
            throw insertError;
          }
        }
      }
      
      // Refresh comments to get updated vote counts
      await refreshComments();
      
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleAddReplyToComment = async (parentId, replyContent) => {
    if (!replyContent.trim()) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      
      if (!user) {
        alert("You must be logged in to reply");
        return;
      }
      
      const { error } = await supabase.from("Komentar").insert({
        isi_komentar: replyContent,
        artikel_id: postId,
        id_user: user.id,
        parent_id: parentId,
      });
      
      if (error) {
        throw error;
      }
      
      // Refresh comments after adding reply
      await refreshComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  const CommentComponent = ({ comment, isReply = false }) => {
    const [replyingToThisComment, setReplyingToThisComment] = useState(false);
    const [currentReplyText, setCurrentReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(true); // State to control reply visibility

    const handleReplySubmit = async () => {
      if (!currentReplyText.trim()) return;
      await handleAddReplyToComment(comment.id, currentReplyText);
      setCurrentReplyText("");
      setReplyingToThisComment(false);
    };

    return (
      <div className={`flex gap-3 ${isReply ? "mb-3 bg-gray-50 p-3 rounded-lg" : "mb-4 p-4 bg-white rounded-lg shadow-sm border"}`}>
        <img
          src={comment.Profile?.foto || comment.avatar || "https://placehold.co/40x40/cccccc/000000.png"}
          alt={comment.Profile?.username || comment.username || "User"}
          className={`rounded-full object-cover ${isReply ? "w-8 h-8" : "w-10 h-10"}`}
        />
        <div className="flex-1">
          <div className="flex gap-2 text-sm text-gray-700">
            <span className="font-semibold">
              {comment.Profile?.username || comment.username || "Anonymous"}
            </span>
            {isReply && <span className="text-blue-500 text-xs bg-blue-100 px-2 py-0.5 rounded">replied</span>}
            <span className="text-xs text-gray-400">
              {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : comment.timeAgo}
            </span>
          </div>
          <p className={`my-2 text-gray-800 ${isReply ? "text-sm" : "text-base"}`}>
            {comment.isi_komentar || comment.content}
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span
              className={`cursor-pointer ${
                comment.userVote === "up" ? "text-green-500" : ""
              }`}
              onClick={() => handleVote(comment.id, "up")}
            >
              <MdKeyboardArrowUp />
            </span>
            <span>{comment.upvotes || 0}</span>
            <span
              className={`cursor-pointer ${
                comment.userVote === "down" ? "text-red-500" : ""
              }`}
              onClick={() => handleVote(comment.id, "down")}
            >
              <MdKeyboardArrowDown />
            </span>
            <span>{comment.downvotes || 0}</span>
            {!isReply && (
              <>
                <button
                  onClick={() => setReplyingToThisComment(!replyingToThisComment)}
                  className="text-blue-500 hover:underline"
                >
                  Reply
                </button>
                {comment.replies?.length > 0 && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-gray-500 hover:underline flex items-center gap-1"
                  >
                    {showReplies ? (
                      <>
                        <MdKeyboardArrowUp className="text-xs" />
                        Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </>
                    ) : (
                      <>
                        <MdKeyboardArrowDown className="text-xs" />
                        Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {!isReply && replyingToThisComment && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                className="border px-2 py-1 rounded w-full"
                value={currentReplyText}
                onChange={(e) => setCurrentReplyText(e.target.value)}
                placeholder="Write reply..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleReplySubmit();
                  }
                }}
              />
              <button
                onClick={handleReplySubmit}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                <MdSend />
              </button>
              <button
                onClick={() => {
                  setReplyingToThisComment(false);
                  setCurrentReplyText("");
                }}
                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Replies section - collapsible */}
          {!isReply && comment.replies?.length > 0 && showReplies && (
            <div className="mt-3 border-l-2 border-blue-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                />
              ))}
            </div>
          )}
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Comments ({comments?.length || 0})</h3>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdSend />
          </button>
        </div>

        <div className="space-y-4">
          {commentsToShow &&
            commentsToShow.map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
              />
            ))}
        </div>

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
