// src/components/AuthModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from '../InputField';
import PrimaryBtn from '../PrimaryBtn'; 

// Kita tentukan mode autentikasi yang ada
const AUTH_MODES = {
  LOGIN: 'login',
  SIGN_UP: 'signUp',
};

const AuthModal = ({ id = 'auth_modal', initialMode = AUTH_MODES.LOGIN }) => {
  // State ini akan menyimpan mode form yang sedang aktif: 'login' atau 'signUp'
  const [currentMode, setCurrentMode] = useState(initialMode);

  // State ini untuk menyimpan nilai dari input-input form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // useRef digunakan untuk mendapatkan referensi langsung ke elemen <dialog> HTML
  // Ini penting karena DaisyUI menggunakan JavaScript langsung di elemen <dialog> untuk membuka/menutupnya
  const modalRef = useRef(null);

  // useEffect ini akan berjalan setiap kali nilai 'initialMode' dari parent berubah
  // Tujuannya: memastikan modal selalu membuka form yang benar saat diklik dari navbar
  useEffect(() => {
    setCurrentMode(initialMode);
    // Reset formData setiap kali mode modal berubah
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  }, [initialMode]); // Efek ini hanya akan berjalan jika 'initialMode' berubah

  // Fungsi untuk menangani perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani pengiriman form Login
  const handleLoginSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman reload
    console.log('Form Login dikirim:', { email: formData.email, password: formData.password });
    // TODO: Di sini nanti Anda panggil API untuk proses Login
    // Contoh:
    // try {
    //   const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: formData.email, password: formData.password })
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     console.log('Login berhasil:', data);
    //     modalRef.current?.close(); // Tutup modal jika berhasil
    //   } else {
    //     console.error('Login gagal:', data.message);
    //     // Tampilkan pesan error ke pengguna
    //   }
    // } catch (error) {
    //   console.error('Terjadi error saat login:', error);
    // }
  };

  // Fungsi untuk menangani pengiriman form Sign Up
  const handleSignUpSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman reload
    console.log('Form Sign Up dikirim:', formData);
    // TODO: Di sini nanti Anda panggil API untuk proses Sign Up
    // Contoh:
    // try {
    //   const response = await fetch('/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     console.log('Sign Up berhasil:', data);
    //     setCurrentMode(AUTH_MODES.LOGIN); // Otomatis pindah ke form Login setelah Sign Up berhasil
    //     // Anda juga bisa menutup modal di sini: modalRef.current?.close();
    //   } else {
    //     console.error('Sign Up gagal:', data.message);
    //     // Tampilkan pesan error ke pengguna
    //   }
    // } catch (error) {
    //   console.error('Terjadi error saat sign up:', error);
    // }
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
                    placeholder="More than 8 character"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    ariaLabel="Password"
                />
            </div>
            <PrimaryBtn type="submit" btnLabel="Sign up" />
            <p className="text-sm text-subhead text-center">
              Sudah punya akun?{' '}
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
            <PrimaryBtn type="submit" btnLabel="Log in" />
            <p className="text-sm text-subhead text-center">
              Belum punya akun?{' '}
              <a href="#" className="ulineHover"
                 onClick={(e) => { e.preventDefault(); setCurrentMode(AUTH_MODES.SIGN_UP); }}>
                Sign up
              </a>
            </p>
          </form>
        )}
      </div>

      {/* Ini adalah bagian backdrop modal DaisyUI. Saat diklik, modal akan tertutup. */}
      {/* Tombol 'close' di dalamnya tersembunyi tapi penting untuk fungsionalitas DaisyUI. */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Tutup modal">tutup</button>
      </form>
    </dialog>
  );
};

export { AUTH_MODES }; // Kita ekspor ini agar bisa dipakai di Navbar
export default AuthModal;