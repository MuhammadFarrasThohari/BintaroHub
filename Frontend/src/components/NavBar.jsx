// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router';

import BHubLogo from '../assets/Logo/BHub-Logo.png';

import PrimaryBtn from './PrimaryBtn';
import SecondaryBtn from './SecondaryBtn';
import AuthModal, { AUTH_MODES } from './Auth/AuthModal';
import { supabase } from './Auth/SupabaseClient'; 

const UserProfile = ({ user, onSignOut }) => {
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center space-x-3">
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-10">
          <span className="text-lg">{displayName.charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <span className="font-lsMedium text-allBlack">{displayName}</span>
      <PrimaryBtn onClick={onSignOut} btnLabel="Log Out" />
    </div>
  );
};

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalInitialMode, setModalInitialMode] = React.useState(AUTH_MODES.LOGIN);

  useEffect(() => {
    const getSessionAndListen = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_OUT') {
          console.log('User signed out from NavBar listener.');
        }
      }
    );

    getSessionAndListen();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOpenModal = (mode) => {
    setModalInitialMode(mode);
    document.getElementById('auth_modal')?.showModal();
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('User signed out successfully.');
      // User state will be set to null by the onAuthStateChange listener
    }
  };

  if (loading) {
    return (
      <nav className="border-b-1 border-subsubhead body-font">
        <div className="flex items-center justify-between p-5 px-8">
          <div className="skeleton h-8 w-24"></div>
          <div className="skeleton h-10 w-1/3"></div>
          <div className="flex items-center space-x-4">
            <div className="skeleton h-10 w-20"></div>
            <div className="skeleton h-10 w-20"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b-1 border-subsubhead body-font">
      <div className="flex items-center justify-between p-5 px-8 ">

        <Link to="/" className="flex items-center space-x-2 ">
          <img className="object-contain size-8" alt="logo" src={BHubLogo} loading="lazy" />
          <h2 className="text-xl font-lsSemibold">
            <span className="text-allBlue">Bintaro</span>Hub
          </h2>
        </Link>

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

        <div className="flex items-center justify-between space-x-8 w-1/3 ">
          <nav className="flex space-x-10">
            <a href="#" className='ulineHover'>Rules</a>
            <a href="#" className='ulineHover'>About BintaroHub</a>
          </nav>

          {user ? (
            <UserProfile user={user} onSignOut={handleSignOut} />
          ) : (
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
          )}

          <AuthModal
            id="auth_modal"
            initialMode={modalInitialMode}
            onClose={handleOpenModal} // This handles closing the modal and potentially resetting its state
          />
        </div>

      </div>
    </nav>
  );
};

export default NavBar;