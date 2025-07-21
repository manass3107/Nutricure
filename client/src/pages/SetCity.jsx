import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const SetCity = ({ token, setUser }) => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found!");
      return;
    }
  try {
    console.log('Sending city:', city);
    await axios.patch('/user/city', { city }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('City set!');
    navigate('/dashboard');
  } catch (err) {
    console.error('City update failed:', err);
    alert('City update failed');
  }
};


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Set Your City</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <button type="submit">Save City</button>
      </form>
    </div>
  );
};

export default SetCity;
