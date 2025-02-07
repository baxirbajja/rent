import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Rental Platform</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/ads">Listings</Link>
        {isAuthenticated ? (
          <>
            <Link to="/add-ad">Add Listing</Link>
            {user?.role === 'admin' && (
              <Link to="/admin">Admin Dashboard</Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
