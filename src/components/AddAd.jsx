import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AddAd.css';

const AddAd = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    images: [],
    category: 'apartment',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    amenities: {
      parking: false,
      furnished: false,
      airConditioning: false,
      heating: false,
      internet: false,
      pets: false
    }
  });

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    } else if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      newErrors.area = 'Please enter a valid area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Convert images to base64
    const processImages = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processImages)
      .then(base64Images => {
        setFormData(prev => ({
          ...prev,
          images: base64Images
        }));
      })
      .catch(() => {
        setErrors(prev => ({
          ...prev,
          images: 'Failed to process images. Please try again.'
        }));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const adData = {
        ...formData,
        location: location, // Add the manual location input
        userId: user.id,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Add the new ad to localStorage
      const existingAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const newAd = { ...adData, id: Date.now().toString() };
      localStorage.setItem('ads', JSON.stringify([...existingAds, newAd]));

      navigate('/listings');
    } catch (error) {
      setErrors({ submit: 'Failed to create ad. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-ad-container">
      <h2>Create New Listing</h2>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter listing title"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Describe your property"
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              placeholder="Enter price"
              min="0"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Latitude"
                  value={location.lat}
                  onChange={(e) => setLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                  step="0.000001"
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Longitude"
                  value={location.lng}
                  onChange={(e) => setLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                  step="0.000001"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="room">Room</option>
            </select>
          </div>

          <div className="form-group">
            <label>Area (m²)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={errors.area ? 'error' : ''}
              placeholder="Enter area"
              min="0"
            />
            {errors.area && <span className="error-message">{errors.area}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Images (Max 5)</label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className={errors.images ? 'error' : ''}
          />
          {errors.images && <span className="error-message">{errors.images}</span>}
          
          {previewImages.length > 0 && (
            <div className="image-previews">
              {previewImages.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <div className="amenities-section">
          <h3>Amenities</h3>
          <div className="amenities-grid">
            {Object.entries({
              parking: '🚗 Parking',
              furnished: '🪑 Furnished',
              airConditioning: '❄️ Air Conditioning',
              heating: '🔥 Heating',
              internet: '📶 Internet',
              pets: '🐾 Pets Allowed'
            }).map(([key, label]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.amenities[key]}
                  onChange={handleChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddAd;