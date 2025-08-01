// DonateMedicine.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Pill, MapPin, Phone, Calendar, Image as ImageIcon } from 'lucide-react'; // Added icons

// Custom Modal component for alerts
const MessageBox = ({ message, type, onClose }) => {
  return (
    <div className={`message-box ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

const DonateMedicine = () => {
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let finalImageUrl = null;
      if (image) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', image); // 'file' matches the backend's multer upload.single('file')

        const uploadRes = await axios.post('/upload', formDataForUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        finalImageUrl = uploadRes.data.imageUrl; // Get the Cloudinary URL
      }

      await axios.post('/medicine', {
        name,
        quantity,
        city,
        address,
        phone,
        expiryDate,
        image: finalImageUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessageType('success');
      setMessage('Medicine donation submitted successfully!');
      setTimeout(() => {
        setMessage(null);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Donation failed:', err.response ? err.response.data : err.message);
      setMessageType('error');
      setMessage(`Failed to submit donation: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
      {message && <MessageBox message={message} type={messageType} onClose={() => setMessage(null)} />}
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-green-700 mb-8">Donate Medicine</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="relative">
            <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Medicine Name (e.g., Paracetamol, Amoxicillin)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">#</span>
            <input
              type="text"
              placeholder="Quantity (e.g., 10 tablets, 1 bottle)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800"
            />
          </div>
          <label className="block text-gray-700 font-medium text-left flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-500" /> Expiry Date:
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="mt-1 ml-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-gray-800 flex-grow"
            />
          </label>
          <label className="block text-gray-700 font-medium text-left flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-gray-500" /> Upload Image (Optional):
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              className="mt-1 ml-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
            />
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Submit Donation'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonateMedicine;
