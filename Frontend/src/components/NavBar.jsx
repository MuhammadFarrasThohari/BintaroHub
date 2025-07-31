// src/components/NavBar.jsx
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, Navigate, useNavigate } from "react-router";

import BHubLogo from "../assets/Logo/BHub-Logo.png";

import { FiLogOut } from "react-icons/fi";

import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import AuthModal, { AUTH_MODES } from "./Auth/AuthModal";
import { supabase } from "./Auth/SupabaseClient";

const UserProfile = ({ user, onSignOut }) => {
  const displayName = user.username || user.email?.split('@')[0] || "User";
  const maxNameLength = 6;
  const truncatedName =
    displayName.length > maxNameLength
      ? displayName.slice(0, maxNameLength) + ".."
      : displayName;
  const encodedDisplayName = encodeURIComponent(displayName);
  const customName = user.custom_name || `B/${truncatedName}`;
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex'; // Show fallback
  };

  return (
    <div className="flex items-center space-x-6">
      <Link
        to={`/forum-editor/${encodedDisplayName}`}
        className="flex items-center space-x-2"
      >
        <div className="avatar placeholder h-15">
          {user.foto ? (
            <>
              <img 
                src={user.foto}
                alt={`${displayName}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 items-center justify-center" style={{display: 'none'}}>
                <span className="text-lg font-lsRegular">{displayName.charAt(0).toUpperCase()}</span>
              </div>
            </>
          ) : (
            <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-lg font-lsRegular">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <hgroup className="flex flex-col text-left -gap-2">
          <span className="font-lsRegular capitalize">{truncatedName}</span>
          <span className="font-lsRegular text-xs text-subsubhead">
            {customName}
          </span>
        </hgroup>
      </Link>

      <button
        onClick={onSignOut}
        className="text-xl text-danger rotate-x-0 hover:rotate-x-45 hover:scale-x-110 hover:cursor-pointer ease-out transition-all duration-200"
      >
        <FiLogOut />
      </button>
    </div>
  );
};

// Add onSearch prop to NavBar component
const NavBar = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalInitialMode, setModalInitialMode] = React.useState(
    AUTH_MODES.LOGIN
  );
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getSessionAndListen = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        } else {
          setUser(session?.user || null);
          console.log("User session fetched:", session);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === "SIGNED_OUT") {
          console.log("User signed out from NavBar listener.");
          setUserProfile(null); // Clear profile data on sign out
        }
      }
    );

    getSessionAndListen();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("Profile")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user profile:", error);
        } else {
          console.log("User profile data fetched:", data);
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
      }
    };
    
    getUserProfile();
  }, [user?.id]);

  // Handler for search input changes
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Call the onSearch prop function, passing the search term to the parent
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleOpenModal = (mode) => {
    setModalInitialMode(mode);
    document.getElementById("auth_modal")?.showModal();
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        console.log("User signed out successfully.");
        setUserProfile(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  // Combine user session data with profile data
  const combinedUser = userProfile ? { ...user, ...userProfile } : user;

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
      <div className="flex items-center justify-between p-5 px-8">
        <Link to="/" className="flex items-center space-x-2">
          <img
            className="object-contain size-8"
            alt="BintaroHub logo"
            src={BHubLogo}
            loading="lazy"
          />
          <h2 className="text-xl font-lsSemibold">
            <span className="text-allBlue">Bintaro</span>Hub
          </h2>
        </Link>

        {/* Searchbox */}
        <div className="ml-20 w-[40%]">
          <label className="input input-bordered flex items-center gap-2 w-full input-xl">
            <input
              type="text"
              className="grow focus:outline-allBlue"
              placeholder="Search by title, topic, location—anything is possible!"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <CiSearch className="text-2xl text-subhead" />
          </label>
        </div>

        <div className="flex items-center justify-between space-x-8 w-1/3">
          <nav className="flex space-x-10">
            <a href="#" className="ulineHover">
              Rules
            </a>
            <a href="#" className="ulineHover">
              About us
            </a>
            {user && (
              <Link to="/add-forum" className="ulineHover">
                Add forum
              </Link>
            )}
          </nav>

          {user ? (
            <UserProfile user={combinedUser} onSignOut={handleSignOut} />
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
            onClose={handleOpenModal}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
