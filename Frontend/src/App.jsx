import './App.css'
import { BrowserRouter as Router } from 'react-router'
import { useState } from 'react'

import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import AppRoutes from './routes/Routes'

function App() {


  return (
    <Router>
        <NavBar />
        <Sidebar>
          <AppRoutes/>

        </Sidebar>
     
    </Router>
  ) 
}

export default App
