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
            <h2>Welcome back, {user?.username || 'User'}!</h2>
            <div className="action-buttons">
              <Link to="/AddAd" className="cta-button">
                Post a Rental
              </Link>
              <Link to="/AdsList" className="secondary-button">
                Browse Listings
              </Link>
            </div>
          </div>
        ) : (
          <div className="guest-welcome">
            <p>Join our community to start posting or finding rentals</p>
            <div className="action-buttons">
              <Link to="/Login" className="cta-button">
                Login
              </Link>
              <Link to="/Sign" className="secondary-button">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="feature-icon">🏠</i>
            <h3>Wide Selection</h3>
            <p>Browse through a diverse range of rental properties</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">🔒</i>
            <h3>Secure Platform</h3>
            <p>Your safety and security are our top priorities</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">📱</i>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface for all users</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">💬</i>
            <h3>Direct Communication</h3>
            <p>Connect directly with property owners or renters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
