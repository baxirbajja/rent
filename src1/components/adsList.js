import React from "react";
import { useSelector } from "react-redux";
import './AdsList.css';

export default function AdsList() {
  const ads = useSelector((state) => state.rent.ads);

  return (
    <div className="ads-container">
      <h1 className="ads-title">Available Rentals</h1>
      <div className="ads-grid">
        {ads.length === 0 ? (
          <p>No rentals available yet . Be the first to add one !</p>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="ad-card">
              <img
                src={ad.image || "https://via.placeholder.com/300x200"}
                alt={ad.title}
                className="ad-image"
              />

              <div className="ad-content">
                <h3 className="ad-title">{ad.title}</h3>
                <p className="ad-price">${ad.price}/month</p>
                <p className="ad-location">{ad.location}</p>
                <p className="ad-description">{ad.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
