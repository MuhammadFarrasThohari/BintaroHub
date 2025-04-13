import './App.css'
import { BrowserRouter as Router } from 'react-router'

import NavBar from './components/NavBar'
import AppRoutes from './routes/Routes'

function App() {


  return (
    <Router>
        <NavBar />
        <AppRoutes/>
     
    </Router>
  ) 
}

export default App
