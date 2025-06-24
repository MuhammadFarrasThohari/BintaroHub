// src/components/Auth/AuthModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from '../InputField';
import PrimaryBtn from '../PrimaryBtn';
import { supabase } from './SupabaseClient'; 

const AUTH_MODES = {
  LOGIN: 'login',
  SIGN_UP: 'signUp',
};

const AuthModal = ({ id = 'auth_modal', initialMode = AUTH_MODES.LOGIN, onClose }) => {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setCurrentMode(initialMode);
    setFormData({
      username: '',
      email: '',
      password: '',
    });
    setMessage('');
  }, [initialMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage(`Login failed: ${error.message}`);
        console.error('Login failed:', error);
      } else if (data.user) {
        setMessage('Login successful!');
        console.log('Login successful:', data.user);
        modalRef.current?.close();
      } else {
        setMessage('Please check your email to confirm your account.');
      }
    } catch (error) {
      setMessage(`An unexpected error occurred: ${error.message}`);
      console.error('Error during login:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) {
        setMessage(`Sign up failed: ${error.message}`);
        console.error('Sign Up failed:', error);
      } else if (data.user) {
        setMessage('Sign up successful! Please check your email to verify your account.');
        console.log('Sign Up successful:', data.user);
        setCurrentMode(AUTH_MODES.LOGIN);
        setFormData({ username: '', email: '', password: '' });
      } else {
        setMessage('Sign up successful! Please check your email to verify your account.');
        setCurrentMode(AUTH_MODES.LOGIN);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error) {
      setMessage(`An unexpected error occurred: ${error.message}`);
      console.error('Error during sign up:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <dialog id={id} className="modal" ref={modalRef}>
      <div className="modal-box flex flex-col items-center justify-center gap-8 py-12">
        <div className="space-y-2 text-center">
          {currentMode === AUTH_MODES.SIGN_UP ? (
            <>
              <h3 className="font-lsRegular text-4xl text-allBlack">Sign up</h3>
              <p className="text-subhead">Create a new account</p>
            </>
          ) : (
            <>
              <h3 className="font-lsRegular text-4xl text-allBlack">Log in</h3>
              <p className="text-subhead">Log in an existing account</p>
            </>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('failed') || message.includes('error') ? 'alert-error' : 'alert-success'} w-full max-w-sm`}>
            <span>{message}</span>
          </div>
        )}

        {currentMode === AUTH_MODES.SIGN_UP ? (
          <form className="flex flex-col space-y-10 w-full max-w-sm" onSubmit={handleSignUpSubmit}>
            <div className="space-y-4 w-full">
                <InputField
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    ariaLabel="Username"
                />
                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    ariaLabel="Email"
                />
                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="More than 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    ariaLabel="Password"
                />
            </div>
            <PrimaryBtn type="submit" btnLabel={authLoading ? 'Signing Up...' : 'Sign up'} disabled={authLoading} />
            <p className="text-sm text-subhead text-center">
              Already have an account?{' '}
              <a href="#" className="ulineHover"
                onClick={(e) => { e.preventDefault(); setCurrentMode(AUTH_MODES.LOGIN); }}>
                Log in
              </a>
            </p>
          </form>
        ) : (
          <form className="flex flex-col space-y-10 w-full max-w-sm" onSubmit={handleLoginSubmit}>
            <div className="space-y-4 w-full">
                <InputField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    ariaLabel="Email"
                />
                <InputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    ariaLabel="Password"
                />
            </div>
            <PrimaryBtn type="submit" btnLabel={authLoading ? 'Logging In...' : 'Log in'} disabled={authLoading} />
            <p className="text-sm text-subhead text-center">
              Don't have an account yet?{' '}
              <a href="#" className="ulineHover"
                onClick={(e) => { e.preventDefault(); setCurrentMode(AUTH_MODES.SIGN_UP); }}>
                Sign up
              </a>
            </p>
          </form>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close modal" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export { AUTH_MODES };
export default AuthModal;