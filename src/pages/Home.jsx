import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Our Rental Platform</h1>
        <p className="subtitle">Find your perfect rental space or share your property with others</p>
        
        {isAuthenticated ? (
          <div className="user-welcome">
            <h2>Welcome back {user?.username || ' '}</h2>
            <div className="action-buttons">
              <Link to="/add-ad" className="cta-button">
                Post a Rental
              </Link>
              <Link to="/Ads" className="secondary-button">
                Browse Listings
              </Link>
            </div>
          </div>
        ) : (
          <div className="guest-welcome">
            <p>Join our community to start posting or finding rentals</p>
            <div className="action-buttons">
              <Link to="/login" className="cta-button">
                Login
              </Link>
              <Link to="/signup" className="secondary-button">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

     
    </div>
  );
};

export default Home;
