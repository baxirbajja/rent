import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAds } from "../redux/rentSlice";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./AddAd.css";

// Correction du problème d'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Coordonnées de Rabat
const defaultCenter = {
  lat: 34.0333,
  lng: -6.83333,
};

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  const handleMapClick = (e) => {
    setPosition(e.latlng);
  };

  map.on("click", handleMapClick);

  return position ? <Marker position={position} /> : null;
}

function AddAd() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    location: defaultCenter,
    address: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [position, setPosition] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: position,
    }));
  }, [position]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Erreur lors de la recherche de l'emplacement :", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (location) => {
    const newPosition = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
    setPosition(newPosition);
    setFormData((prev) => ({
      ...prev,
      address: location.display_name,
      location: newPosition,
    }));
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAd = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    dispatch(addAds(newAd));

    // Réinitialisation du formulaire
    setFormData({
      title: "",
      description: "",
      price: "",
      image: null,
      location: defaultCenter,
      address: "",
    });
    setImagePreview(null);
    setPosition(defaultCenter);
    setSearchQuery("");
    setSearchResults([]);

    alert("Annonce créée avec succès !");
  };

  return (
    <div className="add-ad-container">
      <h2 className="add-ad-title">Créer une Nouvelle Annonce</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Entrez le titre de l'annonce"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez votre propriété"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Prix (€/mois)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Entrez le loyer mensuel"
            required
          />
        </div>

        <div className="form-group">
          <label>Télécharger une Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Aperçu" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Entrez l'adresse de la propriété"
            required
          />
        </div>

        <div className="form-group">
          <label>Rechercher un Emplacement</label>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherchez un emplacement..."
              className="search-input"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="search-button"
              disabled={isSearching}
            >
              {isSearching ? "Recherche en cours..." : "Rechercher"}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleLocationSelect(result)}
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            Localisation (Cliquez sur la carte pour définir l'emplacement)
          </label>
          <div className="map-container">
            <MapContainer
              center={defaultCenter}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Créer Annonce
        </button>
      </form>
    </div>
  );
}

export default AddAd;
