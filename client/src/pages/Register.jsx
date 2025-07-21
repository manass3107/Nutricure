import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form Data:', form); // ✅ log here
  try {
    const res = await axios.post('/auth/register', form);    
    localStorage.setItem('city', form.city); 

    alert('Registration successful. You can now log in.');
    navigate('/login');
  } catch (err) {
    console.error('Registration error:', err.response?.data);
    alert(err.response?.data?.error || 'Registration failed');
  }
};


  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          required
        />
        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="City"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
