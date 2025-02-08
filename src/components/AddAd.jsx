import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAds } from "../redux/rentSlice";
import './AddAd.css';

const AddAd = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      price: ""
    });

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

        <button type="submit" className="submit-button">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default AddAd;