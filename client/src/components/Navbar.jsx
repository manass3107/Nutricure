import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>Nutricure</Link>

      {user ? (
        <>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/my-donations" style={styles.link}>My Donations</Link> {/* Consolidated link */}
          <Link to="/donate-food" style={styles.link}>Donate Food</Link>
          <Link to="/donate-medicine" style={styles.link}>Donate Medicine</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white'
  },
  logo: {
    fontSize: '1.2rem',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginRight: '1rem'
  },
  logoutBtn: {
    background: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.3rem 0.7rem',
    cursor: 'pointer'
  }
};