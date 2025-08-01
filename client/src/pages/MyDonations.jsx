import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const MyDonations = () => {
  const [postedDonations, setPostedDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posted');

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const [postedRes, acceptedRes] = await Promise.all([
        axios.get('/donations/my-donations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/donations/accepted-donations', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setPostedDonations(postedRes.data);
      setAcceptedDonations(acceptedRes.data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const getStatus = (donation) => {
    if (donation.status === 'accepted') return 'Accepted';
    if (donation.status === 'completed') return 'Completed';
    const expiryDate = donation.type === 'food' ? donation.expectedEdibleTill : donation.expiryDate;
    if (new Date(expiryDate) < new Date()) return 'Expired';
    return 'Pending';
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/donations/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Donation marked as completed!');
      fetchDonations(); // Re-fetch to update all lists
    } catch (err) {
      console.error('Error completing donation:', err);
      alert('Failed to complete donation.');
    }
  };

  // ✅ New handler for canceling a donation
  const handleCancel = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm("Are you sure you want to cancel this donation?")) {
      try {
        await axios.delete(`/donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Donation canceled successfully!');
        fetchDonations(); // Re-fetch list to update
      } catch (err) {
        console.error('Error canceling donation:', err);
        alert('Failed to cancel donation.');
      }
    }
  };

  if (loading) {
    return <p>Loading your donations...</p>;
  }

  return (
    <div className="my-donations-page" style={{ padding: '2rem' }}>
      <h2>My Donations</h2>
      <div className="tabs" style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('posted')}
          style={{ padding: '0.5rem 1rem', marginRight: '1rem', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: activeTab === 'posted' ? '#eee' : 'white' }}
        >
          Posted Donations
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: activeTab === 'accepted' ? '#eee' : 'white' }}
        >
          Accepted Donations
        </button>
      </div>

      {activeTab === 'posted' && (
        <>
          <h3>Posted Donations</h3>
          {postedDonations.length === 0 ? (
            <p>You have not posted any donations yet.</p>
          ) : (
            <ul>
              {postedDonations.map((item) => (
                <li key={item._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                  {item.image && (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                    />
                  )}
                  <strong>{item.name}</strong> - Type: {item.type}
                  <br />
                  Status: <strong>{getStatus(item)}</strong>
                  <br />
                  Quantity: {item.quantity}<br />
                  {item.type === 'food' && `Edible Till: ${new Date(item.expectedEdibleTill).toLocaleDateString()}`}
                  {item.type === 'medicine' && `Expiry Date: ${new Date(item.expiryDate).toLocaleDateString()}`}
                  <div style={{ marginTop: '0.5rem' }}>
                    {/* ✅ Render the "Cancel" button for pending donations */}
                    {item.status === 'pending' && (
                      <button onClick={() => handleCancel(item._id)}>
                        Cancel
                      </button>
                    )}
                    {/* ✅ Render the "Complete" button for accepted donations */}
                    {item.status === 'accepted' && (
                      <button onClick={() => handleComplete(item._id)} style={{ marginLeft: '1rem' }}>
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {activeTab === 'accepted' && (
        <>
          <h3>Accepted Donations</h3>
          {acceptedDonations.length === 0 ? (
            <p>You have not accepted any donations yet.</p>
          ) : (
            <ul>
              {acceptedDonations.map((item) => (
                <li key={item._id} style={{ marginBottom: '1rem', border: '1px solid #4CAF50', padding: '1rem' }}>
                  <strong>{item.name}</strong> - Type: {item.type}
                  <br />
                  Quantity: {item.quantity}<br />
                  Donor Details:
                  <br />
                  City: {item.city}, Address: {item.address}, Phone: {item.phone}
                  <br />
                  Accepted On: {new Date(item.acceptedAt).toLocaleDateString()}
                  <br />
                  <button onClick={() => handleComplete(item._id)} style={{ marginTop: '0.5rem' }}>
                    Mark as Completed
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default MyDonations;