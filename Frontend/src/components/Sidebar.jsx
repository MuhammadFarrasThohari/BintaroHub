import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const Sidebar = ({ children }) => {
  const navigate = useNavigate()

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

  const [openSections, setOpenSections] = useState({})

  const toggleSection = (title) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
        {children}
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-allWhite border-r-2 border-subsubhead text-base text-allBlack font-lsRegular min-h-full w-56 p-8">
          
          {/* Topik Section */}
          <h3 className='text-lg font-lsSemibold uppercase text-subhead mb-2'>Topik</h3>
          {topikSections.map(section => (
            <li key={section.title}>
              <button 
                className="p-2 my-2"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
              </button>
              {openSections[section.title] && (
                <ul className="pl-2">
                  {section.subtopics.map(subtopic => (
                    <li key={subtopic}>
                      <button 
                        onClick={() => navigate(`/topik/${subtopic.toLowerCase().replace(/ /g, '-')}`)}
                        className="text-left mb-2"
                      >
                        {subtopic}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Kawasan Section */}
          <h3 className='text-lg font-lsSemibold uppercase text-subhead mt-6 mb-2'>Kawasan</h3>
          {kawasanSections.map(section => (
            <li key={section.title}>
              <button 
                className="p-2 my-2"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
              </button>
              
                <ul className="pl-2">
                  {section.subtopics.map(subtopic => (
                    <li key={subtopic}>
                      <button 
                        onClick={() => navigate(`/kawasan/${subtopic.toLowerCase().replace(/ /g, '-')}`)}
                        className="text-left mb-2"
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
