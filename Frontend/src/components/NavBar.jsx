import React from 'react'
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router';

import BHubLogo from '../assets/Logo/BHub-Logo.png'

// components
import PrimaryBtn from './PrimaryBtn';
import SecondaryBtn from './SecondaryBtn';
import AuthModal, {AUTH_MODES} from './Auth/AuthModal';

const NavBar = () => {
  const [modalInitialMode, setModalInitialMode] = React.useState(AUTH_MODES.LOGIN);

  const handleOpenModal = (mode) => {
    setModalInitialMode(mode);
    document.getElementById('auth_modal')?.showModal(); 
  };

  const handleModalClose = () => {
    console.log("Auth modal closed from Navbar.");
    
  };

  return (
    <nav className="border-b-1 border-subsubhead body-font">
      <div className="flex items-center justify-between p-5 px-8 ">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2 ">
          <img className="object-contain size-8" alt="logo" src={BHubLogo} loading="lazy" />
          <h2 className="text-xl font-lsSemibold">
            <span className="text-allBlue">Bintaro</span>Hub
          </h2>
        </Link>

        {/* Center: Search */}
        <div className="ml-20 w-[40%] ">
          <label className="input input-bordered flex items-center gap-2 w-full input-xl ">
            <input 
              type="text" 
              className="grow focus:outline-allBlue " 
              placeholder="Search by title, topic, location—anything is possible!" 
            />
            <CiSearch className="text-2xl text-subhead" />
          </label>
        </div>

        {/* Right: Nav + Buttons */}
        <div className="flex items-center justify-between space-x-8 w-1/3 ">
          <nav className="flex space-x-10  ">
            <a href="#" className='ulineHover'>Rules</a>
            <a href="#" className='ulineHover'>About BintaroHub</a>
          </nav>
          <div className="flex items-center space-x-4">
            <SecondaryBtn 
              onClick={() => handleOpenModal(AUTH_MODES.LOGIN)}
              type="button"
              btnLabel="Log in" 
            />
            <PrimaryBtn 
              onClick={() => handleOpenModal(AUTH_MODES.SIGN_UP)}
              type="button"
              btnLabel="Sign up" 
            />
            
          </div>
          <AuthModal
            id="auth_modal"
            onClose={handleModalClose}
            initialMode={modalInitialMode} // Pass the state variable here
          />
        </div>

      </div>
    </nav>
  )
}

export default NavBar
