import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAds } from "../redux/rentSlice";
import "./AddAd.css";

function AddAd() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAd = {
      title: title,
      description: description,
      price: price,
      location: location,
      image: image,
    };

    dispatch(addAds(newAd));

    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setImage(null);

    alert("Add created successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="add-ad-container">
      <h2 className="add-ad-title">Add New Rental</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Listing
        </button>
      </form>
    </div>
  );
}

export default AddAd;
