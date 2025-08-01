import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

// Custom Modal component for alerts
const MessageBox = ({ message, type, onClose }) => {
  return (
    <div className={`message-box ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('city', user.city);
      setUser(user);
      console.log('Stored City:', user.city);

      setMessageType('success');
      setMessage('Login successful!');
      setTimeout(() => {
        setMessage(null);
        if (!user.city) {
          navigate('/set-city');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error('Login failed:', err);
      setMessageType('error');
      setMessage('Login failed. Please check your credentials.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}
      <form onSubmit={handleLogin} className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md flex flex-col space-y-6 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-green-700 mb-4">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to continue your journey with Nutricure.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg"
        >
          Login
        </button>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 hover:underline font-medium">Register here</Link>
        </p>
      </form>
    </div>
  );
}
