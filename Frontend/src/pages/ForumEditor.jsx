import React, { useState, useEffect } from 'react';
import { BiImage } from 'react-icons/bi';
import { IoLocationOutline } from "react-icons/io5";
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../components/Auth/SupabaseClient';
// Import new icons for edit and delete
import { FiEdit } from 'react-icons/fi'; // For edit icon
import { MdDelete } from 'react-icons/md'; // For delete icon
import BHLogo from '../assets/Logo/BHub-Logo.png';

const ForumEditor = () => {
  const { displayName } = useParams(); // Get displayName from URL params
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setError("Failed to get user session");
          return;
        }
        
        if (!session?.user) {
          console.log("No user session found");
          navigate('/'); // Redirect to home if no user
          return;
        }
        
        setUser(session.user);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      }
    };

    getCurrentUser();
  }, [navigate]);

  // Fetch forums when user is available
  useEffect(() => {
    const fetchForums = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Artikel")
          .select("*")
          .eq("id_penulis", user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching forums:", error);
          setError("Failed to fetch forums");
          return;
        }
        
        console.log("Fetched forums:", data);
        setForums(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred while fetching forums");
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [user?.id]);

  // Handler for delete individual forum
  const handleDeleteForum = async (id) => {
    if (!window.confirm('Are you sure you want to delete this forum?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Artikel")
        .delete()
        .eq("id", id)
        .eq("id_penulis", user.id); // Ensure user can only delete their own forums

      if (error) {
        console.error("Error deleting forum:", error);
        alert("Failed to delete forum. Please try again.");
        return;
      }

      // Remove from local state
      setForums(forums.filter(forum => forum.id !== id));
      console.log(`Forum with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while deleting the forum.");
    }
  };

  // Handler for delete all forums
  const handleDeleteAllForums = async () => {
    if (!window.confirm('Are you sure you want to delete ALL forums? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Artikel")
        .delete()
        .eq("id_penulis", user.id);

      if (error) {
        console.error("Error deleting all forums:", error);
        alert("Failed to delete all forums. Please try again.");
        return;
      }

      setForums([]);
      console.log("All forums deleted successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while deleting all forums.");
    }
  };

  // Handler for edit functionality
  const handleEditForum = (id) => {
    console.log(`Editing forum with ID: ${id}`);
    navigate(`/edit-forum/${id}`); // Navigate to edit page
  };

  // Show loading state
  if (loading) {
    return (
      <section className="mx-24 my-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="mx-24 my-8">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </section>
    );
  }

  // Decode display name from URL
  const decodedDisplayName = displayName ? decodeURIComponent(displayName) : 'User';

  return (
    <section className="mx-24 my-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-end space-x-4">
          <h1 className="uppercase text-lg font-semibold text-gray-800">Your Forum Editor</h1>
          <p className="text-gray-600">B/{decodedDisplayName}</p>
        </div>
        {/* Forum count and Delete all icon */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-lsRegular">Forum Anda ({forums.length})</span>
          {forums.length > 0 && (
            <MdDelete
              className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
              title="Delete All Forums"
              onClick={handleDeleteAllForums}
            />
          )}
        </div>
      </div>

      {/* Empty state */}
      {!loading && forums.length === 0 && (
        <div className="text-center py-12">
          <BiImage className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No forums found. Start by creating one!</p>
          <button 
            onClick={() => navigate('/add-forum')}
            className="btn btn-primary"
          >
            Create Your First Forum
          </button>
        </div>
      )}

      {/* Forums grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forums.map((forum) => (
          <div
            key={forum.id}
            className="bg-white/70 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
          >
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex space-x-1 z-10">
              <FiEdit
                className="w-6 h-6 p-1 bg-white/80 rounded text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                title="Edit Forum"
                onClick={() => handleEditForum(forum.id)}
              />
              <MdDelete
                className="w-6 h-6 p-1 bg-white/80 rounded text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                title="Delete Forum"
                onClick={() => handleDeleteForum(forum.id)}
              />
            </div>

            {/* Image */}
            <div className="aspect-video bg-subsubhead flex items-center justify-center">
              {forum.foto ? (
                <img
                  loading='lazy'
                  src={forum.foto}
                  alt={forum.judul || "Forum post"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BiImage className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center space-x-1 mb-2">
                <img className="object-contain size-4" src={BHLogo} alt="BintaroHub Logo" />
                <h2 className="text-sm font-lsRegular">
                  {forum.category}
                  {forum.tag && (
                    <span className="text-allBlue">—{forum.tag}</span>
                  )}
                </h2>
              </div>

              <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                {forum.judul}
              </h3>

              {/* Additional info */}
              {forum.created_at && (
                <p className="text-xs text-gray-500">
                  Created: {new Date(forum.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ForumEditor;