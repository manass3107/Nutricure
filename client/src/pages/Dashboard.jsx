import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [user, setUser] = useState({});
  const [donations, setDonations] = useState({ food: [], medicine: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ New state for search query

  const fetchDonations = async (search = '') => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const [foodRes, medRes] = await Promise.all([
        axios.get(`/food?search=${search}`, { headers: { Authorization: `Bearer ${token}` } }), // ✅ Pass search query
        axios.get(`/medicine?search=${search}`, { headers: { Authorization: `Bearer ${token}` } }) // ✅ Pass search query
      ]);
      setDonations({ food: foodRes.data, medicine: medRes.data });
    } catch (err) {
      console.error('Error fetching donations:', err);
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
    fetchDonations(searchQuery); // ✅ Initial fetch with empty search
  }, [searchQuery]); // ✅ Re-fetch whenever search query changes

  const handleAccept = async (id, type) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/${type}/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Donation of type ${type} accepted successfully!`);
      fetchDonations(searchQuery); // Re-fetch donations to update the list
    } catch (err) {
      console.error('Error accepting donation:', err);
      alert('Failed to accept donation. It might have been taken by someone else.');
    }
  };

  return (
    <div className="dashboard" style={{ padding: '2rem' }}>
      <h2>Welcome, {user.name}! Showing Donations in {city}</h2> {/* ✅ Updated heading with user's name */}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for donations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Want to donate?</h3>
        <p>
          <Link to="/donate-food">🍱 Donate Food</Link> | <Link to="/donate-medicine">💊 Donate Medicine</Link>
        </p>
      </div>

      {loading && <p>Loading donations...</p>}
<h3>Available Food Donations:</h3>
    <ul>
      {donations.food.length === 0 ? (
        <p>No food donations available in your city.</p>
      ) : (
        donations.food.map((item) => (
          <li key={item._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            {item.image && (
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
              />
            )}
            <strong>{item.name}</strong> - Quantity: {item.quantity}<br />
            City: {item.city}, Address: {item.address}<br />
            Phone: {item.phone}<br />
            Cooked On: {new Date(item.createdAt).toLocaleDateString()}<br />
            Edible Till: {new Date(item.expectedEdibleTill).toLocaleDateString()}
            <br />
            <button onClick={() => handleAccept(item._id, 'food')} style={{ marginTop: '0.5rem' }}>Accept</button>
          </li>
        ))
      )}
    </ul>

    <h3>Available Medicine Donations:</h3>
    <ul>
      {donations.medicine.length === 0 ? (
        <p>No medicine donations available in your city.</p>
      ) : (
        donations.medicine.map((item) => (
          <li key={item._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            {item.image && (
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
              />
            )}
            <strong>{item.name}</strong> - Quantity: {item.quantity}<br />
            City: {item.city}, Address: {item.address}<br />
            Phone: {item.phone}<br />
            Expiry Date: {new Date(item.expiryDate).toLocaleDateString()}
            <br />
            <button onClick={() => handleAccept(item._id, 'medicine')} style={{ marginTop: '0.5rem' }}>Accept</button>
          </li>
        ))
      )}
    </ul>
  </div>
  );
};

export default Dashboard;