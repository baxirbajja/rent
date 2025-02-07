import React from 'react';
import './ListingsMap.css';

const ListingsMap = ({ listings }) => {
  return (
    <div className="listings-map">
      <h3>Property Locations</h3>
      <div className="location-list">
        {listings.map((listing, index) => (
          <div key={index} className="location-item">
            <strong>{listing.title}</strong>
            <p>
              Latitude: {listing.location.lat.toFixed(6)}<br />
              Longitude: {listing.location.lng.toFixed(6)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsMap;
