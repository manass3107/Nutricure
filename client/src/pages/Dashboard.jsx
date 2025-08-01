import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Pill, Search, PlusCircle } from 'lucide-react'; // Added icons

// Custom Modal component for alerts
const MessageBox = ({ message, type, onClose }) => {
  return (
    <div className={`message-box ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [user, setUser] = useState({});
  const [donations, setDonations] = useState({ food: [], medicine: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const fetchDonations = async (search = '') => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [foodRes, medRes] = await Promise.all([
        axios.get(`/food?search=${search}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/medicine?search=${search}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setDonations({ food: foodRes.data, medicine: medRes.data });
    } catch (err) {
      console.error('Error fetching donations:', err);
      setMessageType('error');
      setMessage('Failed to fetch donations.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setCity(parsedUser.city || '');
    }
    fetchDonations(searchQuery);
  }, [searchQuery]);

  const handleAccept = async (id, type) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/${type}/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageType('success');
      setMessage(`Donation of type ${type} accepted successfully!`);
      setTimeout(() => setMessage(null), 3000);
      fetchDonations(searchQuery);
    } catch (err) {
      console.error('Error accepting donation:', err);
      setMessageType('error');
      setMessage('Failed to accept donation. It might have been taken by someone else.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="page-container bg-gray-50 min-h-screen p-6 sm:p-8">
      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}
      <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8">
        Welcome, <span className="text-green-600">{user.name || 'Guest'}</span>!
        <p className="text-xl text-gray-600 mt-2">Showing Donations in <span className="text-green-500 font-semibold">{city || 'your city'}</span></p>
      </h2>

      <div className="mb-8 p-5 bg-white rounded-xl shadow-md flex items-center space-x-3">
        <Search className="w-6 h-6 text-gray-500" />
        <input
          type="text"
          placeholder="Search for food or medicine donations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-lg"
        />
      </div>

      <div className="mb-10 p-6 bg-green-100 rounded-xl shadow-md text-center border border-green-200">
        <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center justify-center">
          <PlusCircle className="w-7 h-7 mr-2 text-green-700" /> Want to donate?
        </h3>
        <p className="text-lg text-gray-700 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
          <Link to="/donate-food" className="flex items-center text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors duration-200">
            <UtensilsCrossed className="w-6 h-6 mr-2 text-blue-600" /> Donate Food
          </Link>
          <span className="hidden sm:inline text-gray-400">|</span>
          <Link to="/donate-medicine" className="flex items-center text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors duration-200">
            <Pill className="w-6 h-6 mr-2 text-blue-600" /> Donate Medicine
          </Link>
        </p>
      </div>

      {loading && <p className="text-center text-gray-600 text-xl font-medium">Loading donations...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Donations Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-green-700 mb-5 border-b pb-3 border-green-200 flex items-center">
            <UtensilsCrossed className="w-6 h-6 mr-2 text-green-600" /> Available Food Donations
          </h3>
          <ul className="space-y-4">
            {donations.food.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No food donations available in your city.</p>
            ) : (
              donations.food.map((item) => (
                <li key={item._id} className="donation-list-item bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center sm:items-start border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  {item.image && (
                    <img
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} // Handle Cloudinary URLs
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-lg mr-4 mb-4 sm:mb-0 shadow-sm"
                    />
                  )}
                  <div className="flex-grow text-gray-700 text-left">
                    <strong className="text-xl font-bold text-gray-800">{item.name}</strong> - <span className="text-md">{item.quantity}</span><br />
                    <span className="text-sm text-gray-500">City: {item.city}, Address: {item.address}</span><br />
                    <span className="text-sm text-gray-500">Phone: {item.phone}</span><br />
                    <span className="text-sm text-gray-500">Cooked On: {new Date(item.createdAt).toLocaleDateString()}</span><br />
                    <span className="text-sm text-gray-500">Edible Till: {new Date(item.expectedEdibleTill).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleAccept(item._id, 'food')}
                    className="mt-4 sm:mt-0 sm:ml-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md"
                  >
                    Accept
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Medicine Donations Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-green-700 mb-5 border-b pb-3 border-green-200 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-green-600" /> Available Medicine Donations
          </h3>
          <ul className="space-y-4">
            {donations.medicine.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No medicine donations available in your city.</p>
            ) : (
              donations.medicine.map((item) => (
                <li key={item._id} className="donation-list-item bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center sm:items-start border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  {item.image && (
                    <img
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} // Handle Cloudinary URLs
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-lg mr-4 mb-4 sm:mb-0 shadow-sm"
                    />
                  )}
                  <div className="flex-grow text-gray-700 text-left">
                    <strong className="text-xl font-bold text-gray-800">{item.name}</strong> - <span className="text-md">{item.quantity}</span><br />
                    <span className="text-sm text-gray-500">City: {item.city}, Address: {item.address}</span><br />
                    <span className="text-sm text-gray-500">Phone: {item.phone}</span><br />
                    <span className="text-sm text-gray-500">Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleAccept(item._id, 'medicine')}
                    className="mt-4 sm:mt-0 sm:ml-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md"
                  >
                    Accept
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
