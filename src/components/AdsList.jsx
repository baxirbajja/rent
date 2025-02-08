import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAds } from '../redux/rentSlice';
import './AdsList.css';

const AdsList = () => {
  const dispatch = useDispatch();
  const { ads } = useSelector((state) => state.rent);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch(removeAds(id));
    }
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="no-ads">
        <h2>No listings available</h2>
        <p>Be the first to add a listing!</p>
      </div>
    );
  }

  return (
    <div className="ads-list">
      <h2>Available Listings</h2>
      <div className="ads-grid">
        {ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            {ad.image && (
              <div className="ad-image">
                <img src={ad.image} alt={ad.title} />
              </div>
            )}
            <div className="ad-content">
              <h3>{ad.title}</h3>
              <p className="description">{ad.description}</p>
              <p className="price">€{ad.price}/month</p>
              {ad.address && (
                <p className="address">
                  <i className="fas fa-map-marker-alt"></i> {ad.address}
                </p>
              )}
              <p className="date">Posted on: {new Date(ad.createdAt).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => handleDelete(ad.id)} 
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsList;