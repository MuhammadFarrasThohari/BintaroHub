// src/pages/AddForum.jsx
import { useState, useEffect } from "react"
import { supabase } from "../components/Auth/SupabaseClient"; 
import { IoPinSharp, IoLocationOutline } from "react-icons/io5";
import { BiImage } from "react-icons/bi"

import { useNavigate } from "react-router";
import PrimaryBtn from "../components/PrimaryBtn"
import BHLogo from "../assets/Logo/BHub-Logo.png"

import { forumPosts } from "../data/forumData";

const topikSections = [
  {
    title: "Berita Lokal",
    subtopics: ["Baru saja", "Kriminalitas", "Kondisi sekitar", "Bencana", "Lalu lintas"],
  },
  {
    title: "Opini & Diskusi",
    subtopics: ["Suara rakyat", "Rekomendasi", "Setuju gak?"],
  },
  {
    title: "Layanan Publik",
    subtopics: ["Fasilitas umum", "Kebijakan lokal", "Bencana"],
  },
  {
    title: "Masyarakat",
    subtopics: ["Sosial & event", "Lingkungan", "Hewan hilang"],
  },
]

const kawasanSections = [
  {
    title: "Lokasi",
    subtopics: [
      "Semua",
      "Sektor 1",
      "Sektor 2",
      "Sektor 3",
      "Sektor 4",
      "Sektor 5",
      "Sektor 6",
      "Sektor 7",
      "Sektor 8",
      "Sektor 9",
    ],
  },
]

const AddForum = ({ onAddForum }) => { // 
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [uploadedImages, setUploadedImages] = useState([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) 
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('User');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("Fetched user:", data.user);

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      // Extract the username from metadata
      const user = data?.user;
      const displayName = user?.user_metadata?.username || user?.email?.split("@")[0] || "User";
      setUser(user);
      setUsername(displayName); // Save it to state
    };

    fetchUser();
  }, []);

  // console.log("Current user:", user);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + uploadedImages.length > 5) {
      alert("Maksimal 5 gambar yang dapat diunggah")
      return
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(), 
    }))

    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((image) => image.id !== id));
  };


  const handleSubmit = async (e) => { // <-- Change to synchronous (remove async/await)
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!title || !description || !selectedCategory || !selectedLocation) {
      alert("Please fill in all required fields (Title, Description, Category, Location).");
      setIsSubmitting(false);
      return;
    }

    // store image to Supabase Storage
    const filePhotoName = `public/${Date.now()}-${title}`
    try{
      const {data, error} = await supabase.storage.from('fotoartikel').upload(filePhotoName, uploadedImages[0].file)
      if (error){
        throw error
      }else{
        console.log("Image uploaded successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    // Get the URL of the uploaded image
    try {
      const { data, error } = await supabase.storage.from('fotoartikel').getPublicUrl(filePhotoName);
      if (error) {
        throw error;
      }else{
        var imageUrl = data.publicUrl;
        console.log("Public URL of the uploaded image:", imageUrl);
      }
      
    } catch (error) {
      console.error("Error getting public URL:", error);
    }


    // --- SIMULATION LOGIC HERE ---
    console.log("Simulating forum submission...");

    // Create a dummy forum object with the collected data
    const newForum = {
      judul: title,
      tag: selectedCategory,
      isi: description,
      id_penulis: user?.id,
      foto: imageUrl,
      lokasi: selectedLocation,
    };
    uploadToSupabase(newForum); // Call the function to upload to Supabase

  }
  const uploadToSupabase = async (newForum) =>{
      const {error} = await supabase.from('Artikel').insert(newForum)
      if (error) {
        console.error("Error inserting forum:", error);
        alert("Failed to submit forum. Please try again.");
        setIsSubmitting(false);
        return;
      } else {
        console.log("Forum submitted successfully:", newForum);
        alert("Forum submitted successfully!");
      }
    
  }

  return (
    <div className="mx-20 p-6 ">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm font-lsLight flex items-center">
        <span className="text-subsubhead">Highlighted forums</span>
        <span className="mx-2">{">"}</span>
        <span className="text-allBlack font-medium">Tambah forum</span>
      </div>

      {/* Topic Selection */}
      <div className='flex gap-2 mb-6 text-sm '>
        <div className='flex items-center space-x-1'>
          <img className='object-contain size-4' src={BHLogo} alt='BintaroHub Logo' />
          <h2 className='text-sm font-lsRegular'>
            Topik—
            <button
              type='button'
              className='text-allBlue underline hover:text-blue-600 cursor-pointer transition-colors max-w-[150px] truncate'
              onClick={() => setShowCategoryModal(true)}
            >
              {selectedCategory || "Pilih Kategori"}
            </button>
          </h2>
        </div>
        <address className='flex items-center space-x-1 ml-4 '>
          <IoLocationOutline className='text-subhead text-base' />
          <h2 className='text-sm font-lsRegular '>
            <button
              type='button'
              className='text-allBlue underline hover:text-blue-600 cursor-pointer transition-colors max-w-[150px] truncate'
              onClick={() => setShowLocationModal(true)}
            >
              {selectedLocation || "Pilih lokasi"}
            </button>
          </h2>
        </address>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div >
          <label htmlFor="title" className="block mb-2 font-lsRegular text-gray-800 text-base">
            Judul forum
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border-2 border-subsubhead rounded transition-all focus:outline-none focus:border-lightBlue placeholder-subsubhead "
            placeholder="Isi judul yang sesuai"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div >
          <label htmlFor="description" className="block mb-2 font-lsRegular text-gray-800 text-base">
            Deskripsi forum
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-3 border-2 border-subsubhead rounded text-sm resize-y h-20 font-lsLight transition-all focus:outline-none focus:border-lightBlue placeholder-subsubhead"
            placeholder="Sesuaikan isi deskripsi dengan perkara"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
        </div>

        {/* Image Upload */}
        <div >
          <div className="flex items-center justify-between mb-2 ">
            <label className="block font-lsRegular text-allBlack text-base">
              Unggah gambar
              <span className="font-normal text-subsubhead text-xs ml-2">Up to 5 images (.png, .jpg)</span>
            </label>
            {uploadedImages.length > 0 && (
              <button
                type="button"
                className="text-danger text-sm underline hover:text-red-600 hover:cursor-pointer transition-all duration-200"
                onClick={() => setUploadedImages([])}
              >
                Kosongkan gambar
              </button>
            )}
          </div>

          {uploadedImages.length === 0 ? (
            <div className="relative border-2 h-28 border-dashed font-lsLight border-gray-300 rounded-lg p-10 text-center transition-colors hover:border-lightBlue">
              <input
                type="file"
                id="image-upload"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                multiple
                accept=".png,.jpg,.jpeg"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center h-full gap-4 cursor-pointer text-gray-500">
                <BiImage size={48} className="text-gray-300" />
                <div className="flex gap-1 text-sm ">
                  <span>Tarik & taruh gambar ke sini</span>
                  <span className="text-gray-400">atau</span>
                  <span className="text-allBlue underline">Pilih gambar dari galeri</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-wrap ">
              {uploadedImages.map((image) => (
                <div key={image.id} className="w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-200 relative group">
                  <img src={image.url || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {uploadedImages.length < 5 && (
                <div className="relative font-lsLight hover:bg-blue-100 cursor-pointer transition-all duration-500 ease-out">
                  <input
                    type="file"
                    id="add-more-images"
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                    multiple
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="add-more-images"
                    className="flex items-center gap-2 px-4 py-2 text-allBlue border border-dashed border-lightBlue rounded-sm"
                  >
                    <BiImage/>
                    <span className="text-sm ">Tambah gambar</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <PrimaryBtn
            type="submit"
            btnLabel={isSubmitting ? "Submitting..." : "Unggah forum"}
            disabled={isSubmitting}
          />
        </div>
      </form>

      {/* Category Modal */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 bg-allBlack/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[90%] max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-lsRegular text-gray-800 m-0">Pilih Kategori</h3>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {topikSections.map((section) => (
                <div key={section.title} className="mb-6 last:mb-0">
                  <h4 className="text-base font-lsRegular text-subhead m-0 mb-3 pb-2 border-b-1 border-subsubhead">
                    {section.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.subtopics.map((subtopic) => (
                      <button
                        key={subtopic}
                        className={`px-4 py-2 rounded-full font-lsLight text-sm cursor-pointer transition-all border-2 ${
                          selectedCategory === subtopic
                            ? "bg-allBlue border-lightBlue text-white"
                            : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-lightBlue"
                        }`}
                        onClick={() => {
                          setSelectedCategory(subtopic)
                          setShowCategoryModal(false)
                        }}
                      >
                        {subtopic}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="fixed inset-0 bg-allBlack/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[90%] max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-lsRegular text-gray-800 m-0">Pilih Lokasi</h3>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                onClick={() => setShowLocationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {kawasanSections.map((section) => (
                <div key={section.title} className="mb-6 last:mb-0">
                  <h4 className="text-base font-lsRegular text-subhead m-0 mb-3 pb-2 border-b-1 border-subsubhead">
                    {section.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.subtopics.map((subtopic) => (
                      <button
                        key={subtopic}
                        className={`px-4 py-2 rounded-full font-lsLight text-sm cursor-pointer transition-all border-2 ${
                          selectedLocation === subtopic
                            ? "bg-allBlue border-lightBlue text-white"
                            : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-lightBlue"
                        }`}
                        onClick={() => {
                          setSelectedLocation(subtopic)
                          setShowLocationModal(false)
                        }}
                      >
                        {subtopic}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddForum;