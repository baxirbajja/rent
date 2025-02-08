import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addAds } from "../redux/rentSlice";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./AddAd.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 48.8566,
  lng: 2.3522
};

function AddAd() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    location: center,
    address: ""
  });

  const [imagePreview, setImagePreview] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDhVhBoIPQZBQ4eAnxCbcExwjWtjML5OYY",
    libraries: ['places']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData(prev => ({
      ...prev,
      location: { lat, lng }
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAd = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    dispatch(addAds(newAd));

    // Reset form
    setFormData({
      title: "",
      description: "",
      price: "",
      image: null,
      location: center,
      address: ""
    });
    setImagePreview(null);

    alert("Listing created successfully!");
  };

  return (
    <div className="add-ad-container">
      <h2 className="add-ad-title">Create New Listing</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter listing title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your property"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Price (€/month)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter monthly rent"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter property address"
            required
          />
        </div>

        <div className="form-group">
          <label>Location (Click on map to set location)</label>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={formData.location}
              zoom={13}
              onClick={handleMapClick}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: true
              }}
            >
              {formData.location && (
                <Marker position={formData.location} />
              )}
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Create Listing
        </button>
      </form>
    </div>
  );
}

export default AddAd;