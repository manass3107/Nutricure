import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Removed MessageSquare icon, kept others relevant to donations/profile
import { Home, Utensils, Pill, User, LogOut, HeartHandshake } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg z-10 relative">
      <Link to="/dashboard" className="text-2xl font-extrabold text-white no-underline hover:text-gray-100 transition-colors duration-300 mb-2 sm:mb-0">Nutricure</Link>

      <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <Home className="w-5 h-5 mr-1" /> Dashboard
            </Link>
            <Link to="/my-donations" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <HeartHandshake className="w-5 h-5 mr-1" /> My Donations
            </Link>
            <Link to="/donate-food" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <Utensils className="w-5 h-5 mr-1" /> Donate Food
            </Link>
            <Link to="/donate-medicine" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <Pill className="w-5 h-5 mr-1" /> Donate Medicine
            </Link>
            <Link to="/profile" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <User className="w-5 h-5 mr-1" /> Profile
            </Link>
            {/* REMOVED: Chat link */}
            {/* <Link to="/chat" className="flex items-center text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">
              <MessageSquare className="w-5 h-5 mr-1" /> Chat
            </Link> */}
            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-green-700 border border-white px-3 py-1 rounded-md hover:bg-green-100 hover:text-green-800 transition-colors duration-200 font-medium shadow-sm"
            >
              <LogOut className="w-5 h-5 mr-1" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">Login</Link>
            <Link to="/register" className="text-white no-underline hover:text-green-100 transition-colors duration-200 px-2 py-1 rounded-md">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
