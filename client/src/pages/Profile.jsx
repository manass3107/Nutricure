import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    // Load the user data from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set the city state from the user data
      if (parsedUser.city) {
        setCity(parsedUser.city);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found!");
      return;
    }
    try {
      await axios.patch('/user/city', { city }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('City updated successfully!');
      
      // Update the user data in localStorage with the new city
      const updatedUser = { ...user, city };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('city', city);
      
      navigate('/dashboard'); // Redirect to dashboard after update
    } catch (err) {
      console.error('City update failed:', err);
      alert('City update failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Update City</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <button type="submit">Update City</button>
      </form>
    </div>
  );
};

export default Profile;