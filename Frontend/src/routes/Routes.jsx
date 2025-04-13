import React from 'react'
import { Route, Routes } from 'react-router'

import ForumHighlights from '../pages/ForumHighlights'
import ForumEditor from '../pages/ForumEditor'
import AddForum from '../pages/AddForum'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ForumHighlights />} />
      <Route path="/forum-editor" element={<ForumEditor />} />
      <Route path="/add-forum" element={<AddForum />} />
    </Routes>
  )
}

export default AppRoutes