import React from 'react'
import BHubLogo from '../assets/Logo/BHub-Logo.png'
import { CiSearch } from "react-icons/ci";

const NavBar = () => {
  return (
    <header className="border-b-2 body-font">
      <div className="flex items-center justify-between p-5 px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <img className="object-contain size-10" alt="logo" src={BHubLogo} loading="lazy" />
          <p className="text-xl font-lsBold">
            <span className="text-allBlue">Bintaro</span>Hub
          </p>
        </div>

        {/* Center: Search */}
        <div className="w-1/2">
          <label className="input input-bordered flex items-center gap-2 w-full input-xl">
            <input 
              type="text" 
              className="grow focus:outline-allBlue " 
              placeholder="Search by title, topic, location—anything is possible!" 
            />
            <CiSearch className="text-2xl text-subhead" />
          </label>
        </div>

        {/* Right: Nav + Buttons */}
        <div className="flex items-center space-x-8">
          <nav className="flex space-x-6 ">
            <a href="#" >Rules</a>
            <a href="#">About BintaroHub</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="btn btn-outline text-base font-lsRegular text-allBlack btn-lg">Log in</button>
            <button className="btn bg-allBlue text-base font-lsRegular text-allWhite btn-lg">Sign up</button>
          </div>
        </div>

      </div>
    </header>
  )
}

export default NavBar
