import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    if (user.status === 'blocked') {
      setError('Your account has been blocked. Please contact support.');
      return;
    }

    // Update Redux state
    dispatch(setUser(user));

    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">Login</button>
        
        <p className="signup-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
