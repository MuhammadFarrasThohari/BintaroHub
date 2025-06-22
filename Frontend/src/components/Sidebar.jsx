import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const Sidebar = ({ children }) => {
  const navigate = useNavigate()

  // State to manage the currently active navigation item for highlighting
  const [activeItem, setActiveItem] = useState('Highlighted Forums');

  // Separate sections for Topik and Kawasan
  const topikSections = [
    {
      title: 'Berita Lokal',
      subtopics: ['Baru saja', 'Kriminalitas', 'Kondisi sekitar', 'Bencana', 'Lalu lintas']
    },
    {
      title: 'Opini & Diskusi',
      subtopics: ['Suara rakyat', 'Rekomendasi', 'Setuju gak?']
    },
    {
      title: 'Layanan Publik',
      subtopics: ['Fasilitas umum', 'Kebijakan lokal', 'Bencana']
    },
    {
      title: 'Masyarakat',
      subtopics: ['Sosial & event', 'Lingkungan', 'Hewan hilang']
    }
  ]

  const kawasanSections = [
    {
      title: 'Lokasi',
      subtopics: [
        'Semua', 'Sektor 1', 'Sektor 2', 'Sektor 3', 'Sektor 4',
        'Sektor 5', 'Sektor 6', 'Sektor 7', 'Sektor 8', 'Sektor 9'
      ]
    }
  ]

  // Handle navigation and set active item
  const handleNavigate = (path, itemName) => {
    navigate(path);
    setActiveItem(itemName);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
        {children}
      </div>

      <div className="drawer-side border-r-1 border-subsubhead">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-allWhite text-subhead font-lsRegular min-h-full w-56 p-8">

          {/* Highlighted Forums (behaves as home page) */}
          <li>
            <button
              onClick={() => handleNavigate('/', 'Highlighted Forums')}
              className={`p-2 my-2 ${activeItem === 'Highlighted Forums' ? 'sidebar-active' : ''}`}
            >
              Highlighted Forums
            </button>
          </li>

          {/* --- */}

          {/* Topik Section */}
          <h3 className='text-lg font-lsSemibold uppercase text-subhead mt-6 mb-2'>Topik</h3>
          {topikSections.map(section => (
            <li key={section.title}>
              {/* REMOVED: onClick handler and active state logic from the main section title button */}
              <button
                className="p-2 my-2" // Just apply base styles
              >
                {section.title}
              </button>
              <ul className="pl-2">
                {section.subtopics.map(subtopic => (
                  <li key={subtopic}>
                    <button
                      onClick={() => handleNavigate(`/topik/${subtopic.toLowerCase().replace(/ /g, '-')}`, subtopic)}
                      className={`text-left mb-2 ${activeItem === subtopic ? 'sidebar-active' : ''}`}
                    >
                      {subtopic}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* --- */}

          {/* Kawasan Section */}
          <h3 className='text-lg font-lsSemibold uppercase text-subhead mt-6 mb-2'>Kawasan</h3>
          {kawasanSections.map(section => (
            <li key={section.title}>
              {/* REMOVED: onClick handler and active state logic from the main section title button */}
              <button
                className="p-2 my-2" // Just apply base styles
              >
                {section.title}
              </button>
              <ul className="pl-2">
                {section.subtopics.map(subtopic => (
                  <li key={subtopic}>
                    <button
                      onClick={() => handleNavigate(`/kawasan/${subtopic.toLowerCase().replace(/ /g, '-')}`, subtopic)}
                      className={`text-left mb-2 ${activeItem === subtopic ? 'sidebar-active' : ''}`}
                    >
                      {subtopic}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}

        </ul>
      </div>
    </div>
  )
}

export default Sidebar