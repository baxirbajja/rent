import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAds } from '../redux/rentSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import './AdsList.css';

// Fix Leaflet's default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdsList = () => {
  const dispatch = useDispatch();
  const { ads } = useSelector((state) => state.rent);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch(removeAds(id));
    }
  };

  const handleViewMap = (ad) => {
    setSelectedAd(ad);
  };

  const handleCloseMap = () => {
    setSelectedAd(null);
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
              <div className="ad-actions">
                <button 
                  onClick={() => handleViewMap(ad)} 
                  className="view-map-button"
                >
                  View on Map
                </button>
                <button 
                  onClick={() => handleDelete(ad.id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAd && (
        <div className="map-modal">
          <div className="map-modal-content">
            <button className="close-modal" onClick={handleCloseMap}>×</button>
            <h3>{selectedAd.title} - Location</h3>
            <div className="modal-map-container">
              <MapContainer
                center={[selectedAd.location.lat, selectedAd.location.lng]}
                zoom={15}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedAd.location.lat, selectedAd.location.lng]}>
                  <Popup>
                    <strong>{selectedAd.title}</strong><br />
                    {selectedAd.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsList;