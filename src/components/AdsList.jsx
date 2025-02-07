import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AdsList.css';

const AdsList = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'all',
    amenities: {
      parking: false,
      furnished: false,
      airConditioning: false,
      heating: false,
      internet: false,
      pets: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Load ads from localStorage
    try {
      const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
      setAds(storedAds);
      setFilteredAds(storedAds);
      setLoading(false);
    } catch (err) {
      setError('Failed to load listings');
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (name === 'amenities') {
        newFilters.amenities = {
          ...prev.amenities,
          [e.target.dataset.amenity]: checked
        };
      }

      return newFilters;
    });
  };

  useEffect(() => {
    let result = [...ads];

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(ad => ad.category === filters.category);
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(ad => parseFloat(ad.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(ad => parseFloat(ad.price) <= parseFloat(filters.maxPrice));
    }

    // Apply bedrooms filter
    if (filters.bedrooms !== 'all') {
      result = result.filter(ad => ad.bedrooms === filters.bedrooms);
    }

    // Apply amenities filters
    const activeAmenities = Object.entries(filters.amenities)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (activeAmenities.length > 0) {
      result = result.filter(ad => 
        activeAmenities.every(amenity => ad.amenities[amenity])
      );
    }

    setFilteredAds(result);
  }, [filters, ads]);

  if (loading) return <div className="loading">Loading listings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ads-list-container">
      <div className="filters-section">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="room">Room</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
            />
            <span>to</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Bedrooms</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleFilterChange}
          >
            <option value="all">Any</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Amenities</label>
          <div className="amenities-filters">
            {Object.entries({
              parking: '🚗 Parking',
              furnished: '🪑 Furnished',
              airConditioning: '❄️ AC',
              heating: '🔥 Heating',
              internet: '📶 Internet',
              pets: '🐾 Pets'
            }).map(([key, label]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  name="amenities"
                  data-amenity={key}
                  checked={filters.amenities[key]}
                  onChange={handleFilterChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="ads-grid">
        {filteredAds.length === 0 ? (
          <div className="no-results">No listings found matching your criteria</div>
        ) : (
          filteredAds.map(ad => (
            <div key={ad.id} className="ad-card">
              <div className="ad-images">
                {ad.images && ad.images.length > 0 ? (
                  <img src={ad.images[0]} alt={ad.title} />
                ) : (
                  <div className="no-image">No image available</div>
                )}
              </div>
              
              <div className="ad-content">
                <h3>{ad.title}</h3>
                <p className="price">${ad.price}</p>
                <p className="location">{ad.location}</p>
                
                <div className="ad-details">
                  <span>{ad.bedrooms} bed</span>
                  <span>{ad.bathrooms} bath</span>
                  <span>{ad.area} m²</span>
                </div>

                <div className="ad-amenities">
                  {Object.entries(ad.amenities)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <span key={key} className="amenity-tag">
                        {key === 'parking' && '🚗'}
                        {key === 'furnished' && '🪑'}
                        {key === 'airConditioning' && '❄️'}
                        {key === 'heating' && '🔥'}
                        {key === 'internet' && '📶'}
                        {key === 'pets' && '🐾'}
                      </span>
                    ))}
                </div>

                {user && user.id === ad.userId && (
                  <div className="owner-actions">
                    <button className="edit-button">Edit</button>
                    <button className="delete-button">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdsList;