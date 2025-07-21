import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  MdLocationOn,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdComment,
} from "react-icons/md";
import getAllForum from "../data/getForumHighlight"; // Importing the function to fetch forum data

// Placeholder image for error handling (ensure you have this or remove the onError prop)
const COMMON_PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x225?text=No+Image";

function ForumPostCard({ post, onVote, onCardClick }) {
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

  // Destructure 'userVote' from post as well
  const {
    foto,
    tag,
    lokasi,
    judul,
    isi,
    upvotes,
    downvotes,
    comments,
    id,
    userVote,
  } = post;
  const subCategory = subCategoryToParent[tag.toLowerCase()] || null;


  return (
    <div
      className="bg-white/70 rounded shadow-sm hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
      onClick={() => onCardClick(id)}
    >
      <div className="w-full h-48 bg-gray-200 overflow-hidden">
        {" "}
        {/* Changed aspect-video to h-48 and added overflow-hidden */}
        <img
          src={foto}
          alt={judul}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = COMMON_PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MdLocationOn className="w-4 h-4 text-gray-500" />
          <span>
            {tag} {subCategory && `- ${subCategory}`}
          </span>
          <span className="text-gray-400">•</span>
          <span>{lokasi}</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {judul}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{isi}</p>

        <div className="flex items-center justify-between border-t pt-3 mt-auto text-sm text-gray-600">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <MdKeyboardArrowUp
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(id, "up");
                }}
                // Apply green color if user has upvoted
                className={`hover:text-green-500 cursor-pointer ${
                  userVote === "up" ? "text-green-500" : ""
                }`}
              />
              {upvotes}
            </span>
            <span className="flex items-center gap-1">
              <MdKeyboardArrowDown
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(id, "down");
                }}
                // Apply red color if user has downvoted
                className={`hover:text-red-500 cursor-pointer ${
                  userVote === "down" ? "text-red-500" : ""
                }`}
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
  

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllForum();
        console.log("Fetched forum data:", data);
        setForums(data);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      }
    }
    fetchData();
  }, []);

  const { namatopik } = useParams();
  const navigate = useNavigate();

  const [forums, setForums] = useState([]);

  const formatTopicForDisplay = (topic) => {
    if (!topic) return "Highlighted Forums";
    return topic
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredPosts = forums.filter((post) => {
    const topic = formatTopicForDisplay(namatopik).toLowerCase();
    return (
      !namatopik ||
      namatopik === "highlighted-forums" ||
      post.tag.toLowerCase() === topic ||
      (post.subCategory && post.subCategory.toLowerCase() === topic)
    );
  });

  const handleVote = (id, type) => {
    setForums((prevForums) =>
      prevForums.map((post) => {
        if (post.id === id) {
          const updatedPost = { ...post };

          // If the user is voting the same way again, unvote
          if (updatedPost.userVote === type) {
            if (type === "up") updatedPost.upvotes--;
            else updatedPost.downvotes--;
            updatedPost.userVote = null;
          }
          // If the user is changing their vote (e.g., from up to down)
          else if (
            updatedPost.userVote !== null &&
            updatedPost.userVote !== type
          ) {
            if (updatedPost.userVote === "up")
              updatedPost.upvotes--; // Remove old upvote
            else updatedPost.downvotes--; // Remove old downvote

            if (type === "up") updatedPost.upvotes++; // Add new upvote
            else updatedPost.downvotes++; // Add new downvote
            updatedPost.userVote = type;
          }
          // If the user is voting for the first time or from an unvoted state
          else {
            if (type === "up") updatedPost.upvotes++;
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
          filteredPosts.map((post) => (
            <ForumPostCard
              key={post.id}
              post={post}
              onVote={handleVote}
              onCardClick={handleCardClick}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No posts available.
          </p>
        )}
      </section>
    </main>
  );
};

export default ForumHighlights;
