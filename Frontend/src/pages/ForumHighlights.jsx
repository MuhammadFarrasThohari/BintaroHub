import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MdLocationOn, MdKeyboardArrowUp, MdKeyboardArrowDown, MdComment } from "react-icons/md";
import { forumPosts } from '../data/forumData'; // Assuming forumData.js exports forumPosts

// Placeholder image for error handling (ensure you have this or remove the onError prop)
const COMMON_PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x225?text=No+Image";


function ForumPostCard({ post, onVote, onCardClick }) {
  // Destructure 'userVote' from post as well
  const { image, category, subCategory, location, title, description, upvotes, downvotes, comments, id, userVote } = post;

  return (
    <div
      className="bg-white/70 rounded shadow-sm hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
      onClick={() => onCardClick(id)}
    >
      <div className="w-full h-48 bg-gray-200 overflow-hidden"> {/* Changed aspect-video to h-48 and added overflow-hidden */}
        <img
          src={image}
          alt={title}
          loading='lazy'
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = COMMON_PLACEHOLDER_IMAGE; }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MdLocationOn className="w-4 h-4 text-gray-500" />
          <span>{category} {subCategory && `- ${subCategory}`}</span>
          <span className="text-gray-400">•</span>
          <span>{location}</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{description}</p>

        <div className="flex items-center justify-between border-t pt-3 mt-auto text-sm text-gray-600">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <MdKeyboardArrowUp
                onClick={(e) => { e.stopPropagation(); onVote(id, 'up'); }}
                // Apply green color if user has upvoted
                className={`hover:text-green-500 cursor-pointer ${userVote === 'up' ? 'text-green-500' : ''}`}
              />
              {upvotes}
            </span>
            <span className="flex items-center gap-1">
              <MdKeyboardArrowDown
                onClick={(e) => { e.stopPropagation(); onVote(id, 'down'); }}
                // Apply red color if user has downvoted
                className={`hover:text-red-500 cursor-pointer ${userVote === 'down' ? 'text-red-500' : ''}`}
              />
              {downvotes}
            </span>
            <span className="flex items-center gap-1">
              <MdComment />
              {comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ForumHighlights = () => {
  const { namatopik } = useParams();
  const navigate = useNavigate();

  // Initialize forums state by mapping over forumPosts
  // and adding a 'userVote' property to each post object.
  // This ensures each post can track the user's vote.
  const [forums, setForums] = useState(() => {
    return forumPosts.map(post => ({
      ...post,
      userVote: null // 'null', 'up', or 'down'
    }));
  });

  const formatTopicForDisplay = (topic) => {
    if (!topic) return 'Highlighted Forums';
    return topic.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredPosts = forums.filter(post => {
    const topic = formatTopicForDisplay(namatopik).toLowerCase();
    return !namatopik || namatopik === 'highlighted-forums'
      || post.category.toLowerCase() === topic
      || (post.subCategory && post.subCategory.toLowerCase() === topic);
  });

  const handleVote = (id, type) => {
    setForums(prevForums =>
      prevForums.map(post => {
        if (post.id === id) {
          const updatedPost = { ...post };

          // If the user is voting the same way again, unvote
          if (updatedPost.userVote === type) {
            if (type === 'up') updatedPost.upvotes--;
            else updatedPost.downvotes--;
            updatedPost.userVote = null;
          }
          // If the user is changing their vote (e.g., from up to down)
          else if (updatedPost.userVote !== null && updatedPost.userVote !== type) {
            if (updatedPost.userVote === 'up') updatedPost.upvotes--; // Remove old upvote
            else updatedPost.downvotes--; // Remove old downvote

            if (type === 'up') updatedPost.upvotes++; // Add new upvote
            else updatedPost.downvotes++; // Add new downvote
            updatedPost.userVote = type;
          }
          // If the user is voting for the first time or from an unvoted state
          else {
            if (type === 'up') updatedPost.upvotes++;
            else updatedPost.downvotes++;
            updatedPost.userVote = type;
          }
          return updatedPost;
        }
        return post;
      })
    );
  };

  const handleCardClick = (id) => {
    navigate(`/forum/${id}`);
  };

  return (
    <main className="mx-4 md:mx-16 my-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center uppercase">
        {formatTopicForDisplay(namatopik)}
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <ForumPostCard key={post.id} post={post} onVote={handleVote} onCardClick={handleCardClick} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No posts available.</p>
        )}
      </section>
    </main>
  );
};

export default ForumHighlights;