import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonateFood from './pages/DonateFood';
import DonateMedicine from './pages/DonateMedicine';
import Navbar from './components/Navbar';
import MyDonations from './pages/MyDonations';
import Profile from './pages/Profile';
// import Chat from './pages/Chat'; // REMOVED: No longer importing Chat component

function AppWrapper() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const showNavbar = !['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/donate-food" element={token ? <DonateFood /> : <Navigate to="/" />} />
        <Route path="/donate-medicine" element={token ? <DonateMedicine /> : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
        <Route path="/my-donations" element={token ? <MyDonations /> : <Navigate to="/" />} />
        {/* REMOVED: No longer including Chat route */}
        {/* <Route path="/chat" element={token ? <Chat /> : <Navigate to="/" />} /> */}
        {/* Add a route for /set-city if you have one */}
        {/* <Route path="/set-city" element={token ? <SetCity /> : <Navigate to="/" />} /> */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
