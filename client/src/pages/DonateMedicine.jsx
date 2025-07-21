// DonateMedicine.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const DonateMedicine = ({ token }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null); // ✅ New state for the image file
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = null;
      if (image) {
        // ✅ Step 1: Upload the image file
        const formData = new FormData();
        formData.append('image', image);
        const uploadRes = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        imagePath = uploadRes.data.imagePath;
      }

      // ✅ Step 2: Submit the donation data with the image path
      await axios.post('/medicine', {
        name,
        quantity,
        city,
        address,
        phone,
        expiryDate,
        image: imagePath, // ✅ Add the image path
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Medicine donation submitted!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Donation failed:', err);
      alert('Failed to submit donation');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Donate Medicine</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Medicine Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        <input type="text" placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="date" placeholder="Expiry Date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
        <label>
          Upload Image:
          <input type="file" onChange={(e) => setImage(e.target.files[0])} /> {/* ✅ New input for image upload */}
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DonateMedicine;