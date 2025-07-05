import React, { useState, useEffect } from 'react';
import { BiImage } from 'react-icons/bi';
import { IoLocationOutline } from "react-icons/io5";
// Import new icons for edit and delete
import { FiEdit } from 'react-icons/fi'; // For edit icon
import { MdDelete } from 'react-icons/md'; // For delete icon

import BHLogo from '../assets/Logo/BHub-Logo.png';

const ForumEditor = () => {
  const [displayName, setDisplayName] = useState('test2');
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null); // No real error since this is dummy

  useEffect(() => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const dummyForums = [
        {
          id: 1,
          title: 'Lampu Jalan Mati di Sektor 4',
          description: 'Sudah 3 malam lampu jalan di dekat taman sektor 4 mati total.',
          category: 'Layanan Publik',
          subcategory: 'Fasilitas Umum',
          location: 'Sektor 4',
          image: 'https://placehold.co/600x400?text=Lampu+Jalan+Mati',
          hasImage: true,
        },
        {
          id: 2,
          title: 'Hewan Hilang: Kucing Persia Abu-abu',
          description: 'Terakhir terlihat di sekitar masjid besar sektor 6. Mohon bantuan jika ada yang melihat.',
          category: 'Masyarakat',
          subcategory: 'Hewan Hilang',
          location: 'Sektor 6',
          image: 'https://placehold.co/600x400?text=Kemacetan+Parah',
          hasImage: false,
        },
        {
          id: 3,
          title: 'Kemacetan Parah di Jalan Boulevard',
          description: 'Kemacetan sudah berlangsung sejak pagi. Kemungkinan ada kecelakaan kecil.',
          category: 'Berita Lokal',
          subcategory: 'Lalu Lintas',
          location: 'Sektor 2',
          image: 'https://placehold.co/600x400?text=Kemacetan+Parah',
          hasImage: true,
        },
      ];

      setForums(dummyForums);
      setLoading(false);
    }, 1000);
  }, []);

  // Handler for delete functionality (you'd replace this with actual API calls)
  const handleDeleteForum = (id) => {
    if (window.confirm('Are you sure you want to delete this forum?')) {
      setForums(forums.filter(forum => forum.id !== id));
      console.log(`Deleting forum with ID: ${id}`);
      // In a real app, you would make an API call here to delete the forum from the backend
    }
  };

  // Handler for edit functionality (you'd replace this with navigation or modal opening)
  const handleEditForum = (id) => {
    console.log(`Editing forum with ID: ${id}`);
    // In a real app, you would navigate to an edit page or open a modal for editing
  };

  return (
    <section className="mx-24 my-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-end space-x-4">
          <h1 className="uppercase text-lg font-semibold text-gray-800">Your Forum Editor</h1>
          <p className="text-gray-600">B/{displayName}</p>
        </div>
        {/* Forum Anda count and Delete icon */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 font-lsRegular">Forum Anda ({forums.length})</span>
          {/* Delete Icon */}
          <MdDelete
            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
            title="Delete All Forums" // You might want to adjust the exact behavior of this delete icon
            onClick={() => {
              // This delete icon near "Forum Anda" could be for batch delete or a more general action.
              // For now, it doesn't have a specific action, but you can assign one if needed.
              // Example: console.log("Delete all forums?");
              // If it's meant to delete all, you'd add confirmation and then setForums([])
              if (window.confirm('Are you sure you want to delete ALL forums? This action cannot be undone.')) {
                setForums([]);
                console.log("All forums deleted!");
              }
            }}
          />
        </div>
      </div>

      {/* Loading and Error */}
      {loading && <p className="text-center text-gray-600">Loading forums...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && forums.length === 0 && (
        <p className="text-center text-gray-600">No forums found. Start by creating one!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forums.map((forum) => (
          <div
            key={forum.id}
            className="bg-white/70 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow relative" // Added relative for absolute positioning of edit icon
          >
            {/* Edit Icon inside the card */}
            <FiEdit
              className="absolute top-2 right-2 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors z-10"
              title="Edit Forum"
              onClick={() => handleEditForum(forum.id)}
            />

            {/* Image */}
            <div className="aspect-video bg-subsubhead flex items-center justify-center">
              {forum.hasImage && forum.image ? (
                <img
                  loading='lazy'
                  src={forum.image}
                  alt="Forum post"
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
                  {forum.subcategory && (
                    <span className="text-allBlue">—{forum.subcategory}</span>
                  )}
                </h2>
              </div>

              <h3 className="text-base font-semibold text-gray-800 mb-2 truncate">
                {forum.title}
              </h3>

              {/* Delete Icon per card (optional, as you also have a global one) */}
              {/* <div className="flex justify-end mt-2">
                <MdDelete
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  title="Delete Forum"
                  onClick={() => handleDeleteForum(forum.id)}
                />
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ForumEditor;